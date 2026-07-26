"""
Reporting and dashboard analytics.

Every query here takes region_id explicitly. Passing None means "all regions"
and is only ever reached through a super-admin route.
"""
from decimal import Decimal

from sqlalchemy import func

from app.extensions import db
from app.models.customer import Customer
from app.models.distribution import DeliveryStatus, Distribution
from app.models.order import Order, OrderItem, OrderStatus
from app.services.inventory_seam import inventory_report

REVENUE_STATUSES = (OrderStatus.APPROVED, OrderStatus.FULFILLED)


def _scope(query, model, region_id):
    return query if region_id is None else query.filter(model.region_id == region_id)


def _date_filter(query, start_date=None, end_date=None):
    if start_date:
        query = query.filter(Order.created_at >= start_date)
    if end_date:
        query = query.filter(Order.created_at <= end_date)
    return query


def _money(value):
    return str(Decimal(str(value or 0)).quantize(Decimal("0.01")))


def sales_report(region_id, start_date=None, end_date=None):
    base = _scope(Order.query, Order, region_id)
    base = _date_filter(base, start_date, end_date)

    by_status = dict(
        _date_filter(
            _scope(
                db.session.query(Order.status, func.count(Order.id)), Order, region_id
            ),
            start_date,
            end_date,
        )
        .group_by(Order.status)
        .all()
    )

    revenue = (
        _date_filter(
            _scope(
                db.session.query(func.coalesce(func.sum(Order.total_amount), 0)),
                Order,
                region_id,
            ),
            start_date,
            end_date,
        )
        .filter(Order.status.in_(REVENUE_STATUSES))
        .scalar()
    )

    by_product = (
        _date_filter(
            _scope(
                db.session.query(
                    OrderItem.fuel_id,
                    func.sum(OrderItem.quantity),
                    func.sum(OrderItem.line_total),
                ).join(Order, Order.id == OrderItem.order_id),
                Order,
                region_id,
            ),
            start_date,
            end_date,
        )
        .filter(Order.status.in_(REVENUE_STATUSES))
        .group_by(OrderItem.fuel_id)
        .all()
    )

    return {
        "region_id": region_id,
        "period": {
            "start": str(start_date) if start_date else None,
            "end": str(end_date) if end_date else None,
        },
        "total_orders": base.count(),
        "orders_by_status": {
            status.value: count for status, count in by_status.items()
        },
        "total_revenue": _money(revenue),
        "by_product": [
            {
                "fuel_id": fuel_id,
                "quantity_sold": str(qty),
                "revenue": _money(total),
            }
            for fuel_id, qty, total in by_product
        ],
    }


def revenue_summary(region_id, start_date=None, end_date=None, limit=12):
    """Revenue grouped by month. strftime keeps it portable across SQLite and Postgres."""
    month = func.strftime("%Y-%m", Order.created_at) if db.engine.name == "sqlite" \
        else func.to_char(Order.created_at, "YYYY-MM")

    rows = (
        _date_filter(
            _scope(
                db.session.query(
                    month.label("month"),
                    func.count(Order.id),
                    func.coalesce(func.sum(Order.total_amount), 0),
                ),
                Order,
                region_id,
            ),
            start_date,
            end_date,
        )
        .filter(Order.status.in_(REVENUE_STATUSES))
        .group_by("month")
        .order_by("month")
        .limit(limit)
        .all()
    )

    return {
        "region_id": region_id,
        "months": [
            {"month": m, "orders": count, "revenue": _money(total)}
            for m, count, total in rows
        ],
    }


def top_customers(region_id, limit=5):
    rows = (
        _scope(
            db.session.query(
                Customer.id,
                Customer.name,
                func.count(Order.id),
                func.coalesce(func.sum(Order.total_amount), 0),
            ).join(Order, Order.customer_id == Customer.id),
            Order,
            region_id,
        )
        .filter(Order.status.in_(REVENUE_STATUSES))
        .group_by(Customer.id, Customer.name)
        .order_by(func.sum(Order.total_amount).desc())
        .limit(limit)
        .all()
    )
    return [
        {"customer_id": cid, "name": name, "orders": count, "revenue": _money(total)}
        for cid, name, count, total in rows
    ]


def delivery_report(region_id):
    rows = (
        _scope(
            db.session.query(Distribution.status, func.count(Distribution.id)),
            Distribution,
            region_id,
        )
        .group_by(Distribution.status)
        .all()
    )
    counts = {status.value: count for status, count in rows}
    return {
        "region_id": region_id,
        "by_status": {s.value: counts.get(s.value, 0) for s in DeliveryStatus},
        "total": sum(counts.values()),
    }


def dashboard_stats(region_id, user_id=None, is_admin=False):
    """
    Feeds the dashboard described in the spec.

    A normal user gets their own recent orders; an admin gets the regional
    pending queue and revenue as well.
    """
    stats = {
        "region_id": region_id,
        "inventory": inventory_report(region_id),
        "pending_orders": _scope(
            Order.query.filter(Order.status == OrderStatus.PENDING), Order, region_id
        ).count(),
        "total_customers": _scope(
            Customer.query.filter(Customer.is_active.is_(True)), Customer, region_id
        ).count(),
        "deliveries": delivery_report(region_id)["by_status"],
    }

    if user_id is not None:
        my_orders = (
            _scope(Order.query, Order, region_id)
            .filter(Order.created_by_id == user_id)
            .order_by(Order.created_at.desc())
            .limit(5)
            .all()
        )
        stats["my_recent_orders"] = [
            {
                "id": o.id,
                "order_number": o.order_number,
                "customer": o.customer.name if o.customer else None,
                "status": o.status.value,
                "total_amount": _money(o.total_amount),
                "created_at": o.created_at.isoformat(),
            }
            for o in my_orders
        ]

    if is_admin:
        revenue = (
            _scope(
                db.session.query(func.coalesce(func.sum(Order.total_amount), 0)),
                Order,
                region_id,
            )
            .filter(Order.status.in_(REVENUE_STATUSES))
            .scalar()
        )
        stats["total_revenue"] = _money(revenue)
        stats["top_customers"] = top_customers(region_id)

    return stats


def consolidated_report():
    """
    Super administrator only - the cross-region comparison.

    The Region model is Dev A's file; if the branch has not merged yet this
    still returns figures keyed by region_id, just without the names.
    """
    try:
        from app.models.region import Region
    except ImportError:
        Region = None

    rows = (
        db.session.query(
            Order.region_id,
            func.count(Order.id),
            func.coalesce(func.sum(Order.total_amount), 0),
        )
        .filter(Order.status.in_(REVENUE_STATUSES))
        .group_by(Order.region_id)
        .all()
    )

    names = {}
    if Region is not None:
        names = {r.id: r.name for r in Region.query.all()}

    regions = [
        {
            "region_id": region_id,
            "region_name": names.get(region_id),
            "orders": count,
            "revenue": _money(total),
            "customers": Customer.query.filter(
                Customer.region_id == region_id
            ).count(),
        }
        for region_id, count, total in rows
    ]
    regions.sort(key=lambda r: Decimal(r["revenue"]), reverse=True)

    return {
        "regions": regions,
        "totals": {
            "orders": sum(r["orders"] for r in regions),
            "revenue": _money(sum(Decimal(r["revenue"]) for r in regions)),
            "customers": sum(r["customers"] for r in regions),
        },
    }

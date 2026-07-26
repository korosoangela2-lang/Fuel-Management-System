"""Delivery scheduling and status transitions."""
from app.utils.timeutils import utcnow

from app.extensions import db
from app.models.distribution import DeliveryStatus, Distribution
from app.models.order import Order, OrderStatus
from app.services.order_service import fulfil_order
from app.utils.errors import Conflict, NotFound, Unprocessable


def resolve_order_for_delivery(order_id, region_id):
    order = Order.query.filter(
        Order.id == order_id, Order.region_id == region_id
    ).one_or_none()

    if order is None:
        raise NotFound("Order not found")
    if order.status != OrderStatus.APPROVED:
        raise Unprocessable(
            "Only an approved order can be scheduled for delivery "
            f"(this one is '{order.status.value}')"
        )
    if order.distribution is not None:
        raise Conflict("This order already has a delivery scheduled")
    return order


def schedule_delivery(payload, region_id, user_id):
    order = resolve_order_for_delivery(payload["order_id"], region_id)

    delivery = Distribution(
        order_id=order.id,
        region_id=order.region_id,   # inherited from the parent order
        vehicle_registration=payload["vehicle_registration"].upper().strip(),
        driver_name=payload["driver_name"],
        driver_phone=payload["driver_phone"],
        scheduled_date=payload["scheduled_date"],
        notes=payload.get("notes"),
        status=DeliveryStatus.PENDING,
        scheduled_by_id=user_id,
    )
    db.session.add(delivery)
    db.session.commit()
    return delivery


def update_delivery(delivery, payload):
    if delivery.status == DeliveryStatus.DELIVERED:
        raise Conflict("A completed delivery can no longer be edited")

    for field in ("vehicle_registration", "driver_name", "driver_phone",
                  "scheduled_date", "notes"):
        if field in payload:
            setattr(delivery, field, payload[field])

    db.session.commit()
    return delivery


def change_status(delivery, new_status_value, notes=None):
    """
    Pending -> In Transit -> Delivered.

    Reaching DELIVERED is what draws down regional inventory. The whole thing
    runs in one transaction so a failure part-way cannot leave stock deducted
    against a delivery that never closed.
    """
    new_status = DeliveryStatus(new_status_value)

    if new_status == delivery.status:
        return delivery  # idempotent no-op

    if not delivery.can_transition_to(new_status):
        raise Conflict(
            f"Cannot move a delivery from '{delivery.status.value}' "
            f"to '{new_status.value}'"
        )

    try:
        delivery.status = new_status
        if notes:
            delivery.notes = notes

        if new_status == DeliveryStatus.IN_TRANSIT:
            delivery.dispatched_at = utcnow()

        elif new_status == DeliveryStatus.DELIVERED:
            delivery.delivered_at = utcnow()
            if not delivery.stock_deducted:
                fulfil_order(delivery.order)
                delivery.stock_deducted = True

        elif new_status == DeliveryStatus.PENDING:
            # Rescheduling a failed run - clear the dispatch timestamp.
            delivery.dispatched_at = None

        db.session.add(delivery)
        db.session.commit()
    except Exception:
        db.session.rollback()
        raise

    return delivery

"""
Order business rules.

Kept out of the route handlers so the delivery flow can reuse them and so the
rules are testable without an HTTP client.
"""
from app.utils.timeutils import utcnow
from decimal import Decimal
from uuid import uuid4

from app.extensions import db
from app.models.customer import Customer
from app.models.order import Order, OrderItem, OrderStatus
from app.services.inventory_seam import check_availability, deduct_stock, get_fuel_snapshot
from app.utils.errors import Conflict, NotFound, Unprocessable


def generate_order_number(region_id):
    """
    Human-readable and collision-free without a counter table.

    A sequential per-region counter would need row locking to stay correct
    under concurrent inserts; a random suffix avoids the contention entirely.
    """
    return f"ORD-{int(region_id):03d}-{uuid4().hex[:8].upper()}"


def resolve_customer(customer_id, region_id):
    """A customer must belong to the same region as the order being raised."""
    customer = Customer.query.filter(
        Customer.id == customer_id, Customer.region_id == region_id
    ).one_or_none()

    if customer is None:
        # 404 rather than "wrong region" - do not confirm the record exists.
        raise NotFound("Customer not found")
    if not customer.is_active:
        raise Unprocessable("This customer account is inactive")
    return customer


def build_items(order, items_payload, region_id):
    """
    Replace an order's line items from a validated payload.

    Prices and availability are both read from the region's inventory, so an
    order can never be raised against another branch's stock.
    """
    seen = set()
    order.items.clear()

    for line in items_payload:
        fuel_id = line["fuel_id"]
        quantity = Decimal(str(line["quantity"]))

        if fuel_id in seen:
            raise Unprocessable(
                f"Fuel product {fuel_id} appears more than once in this order"
            )
        seen.add(fuel_id)

        snapshot = get_fuel_snapshot(fuel_id, region_id)
        if snapshot is None:
            raise NotFound(f"Fuel product {fuel_id} not found in this region")

        if not check_availability(fuel_id, quantity, region_id):
            raise Unprocessable(
                f"Insufficient stock for {snapshot['name']}: "
                f"requested {quantity}, available {snapshot['quantity_available']}"
            )

        item = OrderItem(
            fuel_id=fuel_id,
            quantity=quantity,
            unit_price=snapshot["unit_price"],
        )
        item.compute_line_total()
        order.items.append(item)

    order.recalculate_total()
    return order


def create_order(payload, region_id, user_id):
    customer = resolve_customer(payload["customer_id"], region_id)

    order = Order(
        order_number=generate_order_number(region_id),
        customer_id=customer.id,
        region_id=region_id,          # from the token, never the request body
        created_by_id=user_id,
        status=OrderStatus.PENDING,
        delivery_address=payload.get("delivery_address") or customer.address,
        notes=payload.get("notes"),
    )
    build_items(order, payload["items"], region_id)

    db.session.add(order)
    db.session.commit()
    return order


def update_order(order, payload, region_id):
    if not order.is_editable:
        raise Conflict(
            f"An order with status '{order.status.value}' can no longer be edited"
        )

    if "items" in payload:
        build_items(order, payload["items"], region_id)
    if "delivery_address" in payload:
        order.delivery_address = payload["delivery_address"]
    if "notes" in payload:
        order.notes = payload["notes"]

    db.session.commit()
    return order


def approve_order(order, user_id):
    if not order.can_transition_to(OrderStatus.APPROVED):
        raise Conflict(
            f"Cannot approve an order with status '{order.status.value}'"
        )

    # Stock may have moved between raising and approving, so re-check rather
    # than trusting the availability test done at creation time.
    for item in order.items:
        if not check_availability(item.fuel_id, item.quantity, order.region_id):
            raise Unprocessable(
                f"Stock is no longer sufficient for fuel product {item.fuel_id}"
            )

    order.status = OrderStatus.APPROVED
    order.approved_by_id = user_id
    order.approved_at = utcnow()
    db.session.commit()
    return order


def cancel_order(order, reason):
    if not order.can_transition_to(OrderStatus.CANCELLED):
        raise Conflict(
            f"Cannot cancel an order with status '{order.status.value}'"
        )
    if order.distribution and order.distribution.status.value == "in_transit":
        raise Conflict("Cannot cancel an order that is already in transit")

    order.status = OrderStatus.CANCELLED
    order.cancelled_at = utcnow()
    order.cancellation_reason = reason
    db.session.commit()
    return order


def fulfil_order(order):
    """
    Called by the distribution service when a delivery is marked DELIVERED.

    Deducts stock for every line and closes the order. The caller owns the
    commit so the deduction and the status change land in one transaction.
    """
    if not order.can_transition_to(OrderStatus.FULFILLED):
        raise Conflict(
            f"Cannot fulfil an order with status '{order.status.value}'"
        )

    for item in order.items:
        deduct_stock(item.fuel_id, item.quantity, order.region_id)

    order.status = OrderStatus.FULFILLED
    db.session.add(order)
    return order

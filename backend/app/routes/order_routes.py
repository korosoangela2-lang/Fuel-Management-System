"""Fuel order endpoints. Base path /api/orders."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.models.customer import Customer
from app.models.order import Order, OrderStatus
from app.schemas.order_schema import (
    order_cancel_schema,
    order_create_schema,
    order_query_schema,
    order_schema,
    order_update_schema,
    orders_schema,
)
from app.services import order_service
from app.utils.pagination import paginate
from app.utils.scoping import (
    ROLE_REGIONAL_ADMIN,
    current_identity,
    get_or_404,
    resolve_region_for_write,
    role_required,
    scope_to_region,
)

order_bp = Blueprint("orders", __name__, url_prefix="/api/orders")


@order_bp.get("")
@jwt_required()
def list_orders():
    filters = order_query_schema.load(request.args.to_dict(), partial=True)
    query = scope_to_region(Order.query, Order)

    if "status" in filters:
        query = query.filter(Order.status == OrderStatus(filters["status"]))
    if "customer_id" in filters:
        query = query.filter(Order.customer_id == filters["customer_id"])
    if "start_date" in filters:
        query = query.filter(Order.created_at >= filters["start_date"])
    if "end_date" in filters:
        query = query.filter(Order.created_at <= filters["end_date"])
    if filters.get("search"):
        term = f"%{filters['search'].strip()}%"
        query = query.join(Customer, Customer.id == Order.customer_id).filter(
            Order.order_number.ilike(term) | Customer.name.ilike(term)
        )

    # A normal user sees their own orders; admins see the whole region.
    identity = current_identity()
    if identity["role"] not in ("regional_admin", "super_admin") and \
            request.args.get("mine", "false").lower() == "true":
        query = query.filter(Order.created_by_id == identity["user_id"])

    query = query.order_by(Order.created_at.desc())
    return jsonify(paginate(query, orders_schema)), 200


@order_bp.get("/<int:order_id>")
@jwt_required()
def get_order(order_id):
    order = get_or_404(Order, order_id)
    return jsonify(order_schema.dump(order)), 200


@order_bp.post("")
@jwt_required()
def create_order():
    data = order_create_schema.load(request.get_json() or {})
    identity = current_identity()
    region_id = resolve_region_for_write(data.get("region_id"))

    order = order_service.create_order(data, region_id, identity["user_id"])
    return jsonify(order_schema.dump(order)), 201


@order_bp.patch("/<int:order_id>")
@jwt_required()
def update_order(order_id):
    order = get_or_404(Order, order_id)
    data = order_update_schema.load(request.get_json() or {}, partial=True)
    order = order_service.update_order(order, data, order.region_id)
    return jsonify(order_schema.dump(order)), 200


@order_bp.post("/<int:order_id>/approve")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def approve_order(order_id):
    order = get_or_404(Order, order_id)
    identity = current_identity()
    order = order_service.approve_order(order, identity["user_id"])
    return jsonify(order_schema.dump(order)), 200


@order_bp.post("/<int:order_id>/cancel")
@jwt_required()
def cancel_order(order_id):
    order = get_or_404(Order, order_id)
    data = order_cancel_schema.load(request.get_json() or {})
    order = order_service.cancel_order(order, data["reason"])
    return jsonify(order_schema.dump(order)), 200


@order_bp.delete("/<int:order_id>")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def delete_order(order_id):
    """
    Only a pending order can be removed outright. Anything further along is
    cancelled instead, so the audit trail survives.
    """
    from app.extensions import db
    from app.utils.errors import Conflict

    order = get_or_404(Order, order_id)
    if order.status != OrderStatus.PENDING:
        raise Conflict("Only a pending order can be deleted - cancel it instead")

    db.session.delete(order)
    db.session.commit()
    return jsonify({"message": "Order deleted", "id": order_id}), 200

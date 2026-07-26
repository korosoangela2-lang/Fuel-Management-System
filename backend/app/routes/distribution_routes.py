"""Delivery / distribution endpoints. Base path /api/distributions."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.models.distribution import DeliveryStatus, Distribution
from app.schemas.distribution_schema import (
    distribution_create_schema,
    distribution_schema,
    distribution_status_schema,
    distribution_update_schema,
    distributions_schema,
)
from app.services import distribution_service
from app.utils.pagination import paginate
from app.utils.scoping import (
    ROLE_REGIONAL_ADMIN,
    current_identity,
    get_or_404,
    resolve_region_for_write,
    role_required,
    scope_to_region,
)

distribution_bp = Blueprint("distributions", __name__, url_prefix="/api/distributions")


@distribution_bp.get("")
@jwt_required()
def list_distributions():
    query = scope_to_region(Distribution.query, Distribution)

    status = request.args.get("status")
    if status:
        query = query.filter(Distribution.status == DeliveryStatus(status))
    if request.args.get("order_id", type=int):
        query = query.filter(Distribution.order_id == request.args.get("order_id", type=int))

    query = query.order_by(Distribution.scheduled_date.desc())
    return jsonify(paginate(query, distributions_schema)), 200


@distribution_bp.get("/<int:distribution_id>")
@jwt_required()
def get_distribution(distribution_id):
    delivery = get_or_404(Distribution, distribution_id)
    return jsonify(distribution_schema.dump(delivery)), 200


@distribution_bp.post("")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def schedule_distribution():
    body = request.get_json(silent=True) or {}
    data = distribution_create_schema.load(body)
    identity = current_identity()
    region_id = resolve_region_for_write(body.get("region_id"))

    delivery = distribution_service.schedule_delivery(
        data, region_id, identity["user_id"]
    )
    return jsonify(distribution_schema.dump(delivery)), 201


@distribution_bp.patch("/<int:distribution_id>")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def update_distribution(distribution_id):
    delivery = get_or_404(Distribution, distribution_id)
    data = distribution_update_schema.load(request.get_json() or {})
    delivery = distribution_service.update_delivery(delivery, data)
    return jsonify(distribution_schema.dump(delivery)), 200


@distribution_bp.patch("/<int:distribution_id>/status")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def change_distribution_status(distribution_id):
    """
    Pending -> In Transit -> Delivered.

    Marking a delivery DELIVERED is the single point at which regional stock
    is drawn down and the parent order is closed.
    """
    delivery = get_or_404(Distribution, distribution_id)
    data = distribution_status_schema.load(request.get_json() or {})
    delivery = distribution_service.change_status(
        delivery, data["status"], data.get("notes")
    )
    return jsonify(distribution_schema.dump(delivery)), 200


@distribution_bp.get("/track/<order_number>")
@jwt_required()
def track_by_order_number(order_number):
    """Lightweight tracking lookup for the user-facing delivery status widget."""
    from app.models.order import Order
    from app.utils.errors import NotFound

    order = scope_to_region(Order.query, Order).filter(
        Order.order_number == order_number
    ).one_or_none()

    if order is None:
        raise NotFound("Order not found")

    return jsonify(
        {
            "order_number": order.order_number,
            "order_status": order.status.value,
            "delivery": distribution_schema.dump(order.distribution)
            if order.distribution
            else None,
        }
    ), 200

"""Fuel inventory endpoints — Dev A. Base path /api/fuels."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.fuel import Fuel
from app.schemas.fuel_schema import (
    fuel_create_schema,
    fuel_schema,
    fuel_update_schema,
    fuels_schema,
    stock_adjust_schema,
)
from app.services import fuel_service
from app.utils.pagination import paginate
from app.utils.scoping import (
    ROLE_REGIONAL_ADMIN,
    get_or_404,
    resolve_region_for_write,
    role_required,
    scope_to_region,
)

fuel_bp = Blueprint("fuels", __name__, url_prefix="/api/fuels")


@fuel_bp.get("")
@jwt_required()
def list_fuels():
    query = scope_to_region(Fuel.query, Fuel)
    if request.args.get("low_stock", "").lower() == "true":
        query = query.filter(Fuel.quantity_available <= Fuel.reorder_level)
    if request.args.get("fuel_type"):
        query = query.filter(Fuel.fuel_type == request.args["fuel_type"])
    query = query.order_by(Fuel.name.asc())
    return jsonify(paginate(query, fuels_schema)), 200


@fuel_bp.get("/<int:fuel_id>")
@jwt_required()
def get_fuel(fuel_id):
    fuel = get_or_404(Fuel, fuel_id)
    return jsonify(fuel_schema.dump(fuel)), 200


@fuel_bp.post("")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def create_fuel():
    data = fuel_create_schema.load(request.get_json(silent=True) or {})
    fuel = Fuel(
        name=data["name"],
        fuel_type=data.get("fuel_type"),
        unit_price=data["unit_price"],
        quantity_available=data["quantity_available"],
        unit_of_measure=data["unit_of_measure"],
        reorder_level=data["reorder_level"],
        refinery_id=data.get("refinery_id"),
        region_id=resolve_region_for_write(data.get("region_id")),
    )
    db.session.add(fuel)
    db.session.commit()
    return jsonify(fuel_schema.dump(fuel)), 201


@fuel_bp.patch("/<int:fuel_id>")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def update_fuel(fuel_id):
    fuel = get_or_404(Fuel, fuel_id)
    data = fuel_update_schema.load(request.get_json(silent=True) or {})
    # Stock level is never edited here — use the stock endpoints, which keep
    # an auditable reason for every movement.
    data.pop("quantity_available", None)
    for field, value in data.items():
        setattr(fuel, field, value)
    db.session.commit()
    return jsonify(fuel_schema.dump(fuel)), 200


@fuel_bp.post("/<int:fuel_id>/stock/add")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def add_stock(fuel_id):
    fuel = get_or_404(Fuel, fuel_id)
    data = stock_adjust_schema.load(request.get_json(silent=True) or {})
    fuel = fuel_service.add_stock(fuel.id, data["quantity"], fuel.region_id)
    return jsonify(fuel_schema.dump(fuel)), 200


@fuel_bp.delete("/<int:fuel_id>")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def deactivate_fuel(fuel_id):
    fuel = get_or_404(Fuel, fuel_id)
    fuel.is_active = False
    db.session.commit()
    return jsonify({"message": "Fuel product deactivated", "id": fuel.id}), 200

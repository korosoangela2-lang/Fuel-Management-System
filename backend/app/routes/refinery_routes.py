"""Refinery / depot endpoints — Dev A. Base path /api/refineries."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.refinery import Refinery
from app.schemas.refinery_schema import (
    refineries_schema,
    refinery_create_schema,
    refinery_schema,
    refinery_update_schema,
)
from app.utils.pagination import paginate
from app.utils.scoping import (
    ROLE_REGIONAL_ADMIN,
    get_or_404,
    resolve_region_for_write,
    role_required,
    scope_to_region,
)

refinery_bp = Blueprint("refineries", __name__, url_prefix="/api/refineries")


@refinery_bp.get("")
@jwt_required()
def list_refineries():
    query = scope_to_region(Refinery.query, Refinery).order_by(Refinery.name.asc())
    return jsonify(paginate(query, refineries_schema)), 200


@refinery_bp.get("/<int:refinery_id>")
@jwt_required()
def get_refinery(refinery_id):
    refinery = get_or_404(Refinery, refinery_id)
    return jsonify(refinery_schema.dump(refinery)), 200


@refinery_bp.post("")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def create_refinery():
    data = refinery_create_schema.load(request.get_json(silent=True) or {})
    refinery = Refinery(
        name=data["name"],
        location=data.get("location"),
        capacity=data["capacity"],
        region_id=resolve_region_for_write(data.get("region_id")),
    )
    db.session.add(refinery)
    db.session.commit()
    return jsonify(refinery_schema.dump(refinery)), 201


@refinery_bp.patch("/<int:refinery_id>")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def update_refinery(refinery_id):
    refinery = get_or_404(Refinery, refinery_id)
    data = refinery_update_schema.load(request.get_json(silent=True) or {})
    for field, value in data.items():
        setattr(refinery, field, value)
    db.session.commit()
    return jsonify(refinery_schema.dump(refinery)), 200


@refinery_bp.delete("/<int:refinery_id>")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def deactivate_refinery(refinery_id):
    refinery = get_or_404(Refinery, refinery_id)
    refinery.is_active = False
    db.session.commit()
    return jsonify({"message": "Refinery deactivated", "id": refinery.id}), 200

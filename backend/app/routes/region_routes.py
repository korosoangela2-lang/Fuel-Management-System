"""Region endpoints — Dev A. Super administrator only. Base path /api/regions."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models.region import Region
from app.schemas.region_schema import (
    region_create_schema,
    region_schema,
    region_update_schema,
    regions_schema,
)
from app.utils.errors import Conflict, NotFound
from app.utils.pagination import paginate
from app.utils.scoping import ROLE_SUPER_ADMIN, role_required

region_bp = Blueprint("regions", __name__, url_prefix="/api/regions")


@region_bp.get("")
@jwt_required()
@role_required(ROLE_SUPER_ADMIN)
def list_regions():
    query = Region.query.order_by(Region.name.asc())
    return jsonify(paginate(query, regions_schema)), 200


@region_bp.get("/<int:region_id>")
@jwt_required()
@role_required(ROLE_SUPER_ADMIN)
def get_region(region_id):
    region = db.session.get(Region, region_id)
    if region is None:
        raise NotFound("Region not found")
    return jsonify(region_schema.dump(region)), 200


@region_bp.post("")
@jwt_required()
@role_required(ROLE_SUPER_ADMIN)
def create_region():
    data = region_create_schema.load(request.get_json(silent=True) or {})
    region = Region(name=data["name"], code=data["code"].upper())
    db.session.add(region)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise Conflict("A region with that name or code already exists")
    return jsonify(region_schema.dump(region)), 201


@region_bp.patch("/<int:region_id>")
@jwt_required()
@role_required(ROLE_SUPER_ADMIN)
def update_region(region_id):
    region = db.session.get(Region, region_id)
    if region is None:
        raise NotFound("Region not found")
    data = region_update_schema.load(request.get_json(silent=True) or {})
    if "code" in data:
        data["code"] = data["code"].upper()
    for field, value in data.items():
        setattr(region, field, value)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise Conflict("Another region already uses that name or code")
    return jsonify(region_schema.dump(region)), 200


@region_bp.delete("/<int:region_id>")
@jwt_required()
@role_required(ROLE_SUPER_ADMIN)
def deactivate_region(region_id):
    """Soft delete — a hard delete would orphan every record in the branch."""
    region = db.session.get(Region, region_id)
    if region is None:
        raise NotFound("Region not found")
    region.is_active = False
    db.session.commit()
    return jsonify({"message": "Region deactivated", "id": region.id}), 200

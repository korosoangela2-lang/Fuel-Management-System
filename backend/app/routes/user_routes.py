"""User management — Dev A. Super administrator only. Base path /api/users."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models.region import Region
from app.models.user import Role, User
from app.schemas.user_schema import (
    user_create_schema,
    user_schema,
    user_update_schema,
    users_schema,
)
from app.utils.errors import BadRequest, Conflict, NotFound
from app.utils.pagination import paginate
from app.utils.scoping import ROLE_SUPER_ADMIN, role_required

user_bp = Blueprint("users", __name__, url_prefix="/api/users")


def _validate_role_region(role, region_id):
    """A regional role needs a region; the super admin must not have one."""
    if role == Role.SUPER_ADMIN and region_id is not None:
        raise BadRequest("A super administrator cannot be tied to a region")
    if role in (Role.REGIONAL_ADMIN, Role.USER):
        if region_id is None:
            raise BadRequest(f"A {role} must be assigned to a region")
        if db.session.get(Region, region_id) is None:
            raise BadRequest("The specified region does not exist")


@user_bp.get("")
@jwt_required()
@role_required(ROLE_SUPER_ADMIN)
def list_users():
    query = User.query
    if request.args.get("role"):
        query = query.filter(User.role == request.args["role"])
    if request.args.get("region_id", type=int):
        query = query.filter(User.region_id == request.args.get("region_id", type=int))
    query = query.order_by(User.username.asc())
    return jsonify(paginate(query, users_schema)), 200


@user_bp.get("/<int:user_id>")
@jwt_required()
@role_required(ROLE_SUPER_ADMIN)
def get_user(user_id):
    user = db.session.get(User, user_id)
    if user is None:
        raise NotFound("User not found")
    return jsonify(user_schema.dump(user)), 200


@user_bp.post("")
@jwt_required()
@role_required(ROLE_SUPER_ADMIN)
def create_user():
    data = user_create_schema.load(request.get_json(silent=True) or {})
    _validate_role_region(data["role"], data.get("region_id"))

    user = User(
        username=data["username"],
        email=data["email"],
        role=data["role"],
        region_id=data.get("region_id"),
    )
    user.set_password(data["password"])
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise Conflict("That username or email is already in use")
    return jsonify(user_schema.dump(user)), 201


@user_bp.patch("/<int:user_id>")
@jwt_required()
@role_required(ROLE_SUPER_ADMIN)
def update_user(user_id):
    user = db.session.get(User, user_id)
    if user is None:
        raise NotFound("User not found")
    data = user_update_schema.load(request.get_json(silent=True) or {})

    new_role = data.get("role", user.role)
    new_region = data["region_id"] if "region_id" in data else user.region_id
    _validate_role_region(new_role, new_region)

    for field, value in data.items():
        setattr(user, field, value)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise Conflict("That email is already in use")
    return jsonify(user_schema.dump(user)), 200


@user_bp.delete("/<int:user_id>")
@jwt_required()
@role_required(ROLE_SUPER_ADMIN)
def deactivate_user(user_id):
    user = db.session.get(User, user_id)
    if user is None:
        raise NotFound("User not found")
    user.is_active = False
    db.session.commit()
    return jsonify({"message": "User deactivated", "id": user.id}), 200

"""Profile / settings — Dev A. Base path /api/profile. Any authenticated user."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from marshmallow import EXCLUDE, Schema, fields, validate
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models.user import User
from app.schemas.user_schema import user_schema
from app.utils.errors import Conflict, NotFound, Unauthorized

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")


class ProfileUpdateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    email = fields.Email()


class ChangePasswordSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    current_password = fields.Str(required=True, load_only=True)
    new_password = fields.Str(
        required=True, validate=validate.Length(min=8), load_only=True
    )


profile_update_schema = ProfileUpdateSchema()
change_password_schema = ChangePasswordSchema()


def _current_user():
    user = db.session.get(User, int(get_jwt_identity()))
    if user is None:
        raise NotFound("User not found")
    return user


@profile_bp.get("")
@jwt_required()
def get_profile():
    return jsonify(user_schema.dump(_current_user())), 200


@profile_bp.patch("")
@jwt_required()
def update_profile():
    user = _current_user()
    data = profile_update_schema.load(request.get_json(silent=True) or {})
    for field, value in data.items():
        setattr(user, field, value)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise Conflict("That email is already in use")
    return jsonify(user_schema.dump(user)), 200


@profile_bp.post("/change-password")
@jwt_required()
def change_password():
    user = _current_user()
    data = change_password_schema.load(request.get_json(silent=True) or {})
    if not user.check_password(data["current_password"]):
        raise Unauthorized("Your current password is incorrect")
    user.set_password(data["new_password"])
    db.session.commit()
    return jsonify({"message": "Password changed"}), 200

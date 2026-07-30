"""
Authentication service — Dev A.

Tokens carry role and region_id as additional claims. Those exact claim names
are the Phase 0 contract: Dev B's scoping.current_identity() reads them, and
Dev B's conftest mints test tokens with the same two keys. Rename either one
and every region-scoping check silently stops working.
"""
from datetime import timedelta

from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    decode_token,
)

from app.extensions import db
from app.models.region import Region
from app.models.user import Role, User
from app.utils.errors import BadRequest, Conflict, Unauthorized

RESET_PURPOSE = "password_reset"
RESET_TTL = timedelta(minutes=30)


def _claims_for(user):
    return {"role": user.role, "region_id": user.region_id}


def issue_tokens(user):
    identity = str(user.id)
    claims = _claims_for(user)
    return {
        "access_token": create_access_token(identity=identity, additional_claims=claims),
        "refresh_token": create_refresh_token(identity=identity, additional_claims=claims),
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "region_id": user.region_id,
        },
    }


def register_user(data):
    if User.query.filter_by(username=data["username"]).first():
        raise Conflict("That username is already taken")
    if User.query.filter_by(email=data["email"]).first():
        raise Conflict("An account with that email already exists")

    region = db.session.get(Region, data["region_id"])
    if region is None or not region.is_active:
        raise BadRequest("The selected region does not exist or is inactive")

    # Self-registration always creates a plain user. Elevated roles are only
    # granted by a super admin through user management.
    user = User(
        username=data["username"],
        email=data["email"],
        role=Role.USER,
        region_id=region.id,
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return user


def authenticate(username, password):
    user = User.query.filter_by(username=username).first()
    if user is None or not user.check_password(password):
        # One message for both cases so the endpoint can't be used to probe
        # which usernames exist.
        raise Unauthorized("Invalid username or password")
    if not user.is_active:
        raise Unauthorized("This account has been deactivated")
    return user


def make_reset_token(user):
    return create_access_token(
        identity=str(user.id),
        additional_claims={"purpose": RESET_PURPOSE},
        expires_delta=RESET_TTL,
    )


def consume_reset_token(token, new_password):
    try:
        decoded = decode_token(token)
    except Exception:
        raise BadRequest("This reset link is invalid or has expired")

    if decoded.get("purpose") != RESET_PURPOSE:
        raise BadRequest("This token cannot be used to reset a password")

    user = db.session.get(User, int(decoded["sub"]))
    if user is None:
        raise BadRequest("This reset link is invalid or has expired")

    user.set_password(new_password)
    db.session.commit()
    return user

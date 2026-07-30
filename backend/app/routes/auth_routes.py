"""Auth endpoints — Dev A. Base path /api/auth."""
from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import (
    get_jwt,
    get_jwt_identity,
    jwt_required,
)

from app.extensions import db
from app.models.token_blocklist import TokenBlocklist
from app.models.user import User
from app.schemas.auth_schema import (
    LoginSchema,
    PasswordResetConfirmSchema,
    PasswordResetRequestSchema,
    RegisterSchema,
)
from app.schemas.user_schema import user_schema
from app.services import auth_service

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

register_schema = RegisterSchema()
login_schema = LoginSchema()
reset_request_schema = PasswordResetRequestSchema()
reset_confirm_schema = PasswordResetConfirmSchema()


@auth_bp.post("/register")
def register():
    data = register_schema.load(request.get_json(silent=True) or {})
    user = auth_service.register_user(data)
    return jsonify(auth_service.issue_tokens(user)), 201


@auth_bp.post("/login")
def login():
    data = login_schema.load(request.get_json(silent=True) or {})
    user = auth_service.authenticate(data["username"], data["password"])
    return jsonify(auth_service.issue_tokens(user)), 200


@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    from flask_jwt_extended import create_access_token

    user = db.session.get(User, int(get_jwt_identity()))
    if user is None or not user.is_active:
        return jsonify({"error": {"code": "unauthorized",
                                  "message": "Account unavailable", "details": {}}}), 401
    token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role, "region_id": user.region_id},
    )
    return jsonify({"access_token": token}), 200


@auth_bp.post("/logout")
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    db.session.add(TokenBlocklist(jti=jti))
    db.session.commit()
    return jsonify({"message": "Logged out"}), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user = db.session.get(User, int(get_jwt_identity()))
    return jsonify(user_schema.dump(user)), 200


@auth_bp.post("/password-reset/request")
def request_reset():
    data = reset_request_schema.load(request.get_json(silent=True) or {})
    user = User.query.filter_by(email=data["email"]).first()

    # Always return 200 so the endpoint cannot be used to enumerate emails.
    body = {"message": "If that email is registered, a reset link has been sent"}

    if user is not None:
        token = auth_service.make_reset_token(user)
        # No mail server in the MVP: in debug, hand the token back directly so
        # the flow is testable. In production this is where an email goes out.
        if current_app.config.get("DEBUG") or current_app.config.get("TESTING"):
            body["reset_token"] = token

    return jsonify(body), 200


@auth_bp.post("/password-reset/confirm")
def confirm_reset():
    data = reset_confirm_schema.load(request.get_json(silent=True) or {})
    auth_service.consume_reset_token(data["token"], data["new_password"])
    return jsonify({"message": "Password updated, please log in"}), 200

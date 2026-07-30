"""JWT lifecycle callbacks — Dev A. Registered in create_app()."""
from flask import jsonify

from app.extensions import db, jwt
from app.models.token_blocklist import TokenBlocklist


def register_jwt_callbacks(app):
    @jwt.token_in_blocklist_loader
    def _is_revoked(_jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return db.session.query(
            TokenBlocklist.query.filter_by(jti=jti).exists()
        ).scalar()

    def _envelope(message, code, status):
        return jsonify({"error": {"code": code, "message": message, "details": {}}}), status

    @jwt.expired_token_loader
    def _expired(_h, _p):
        return _envelope("Your session has expired, please log in again", "token_expired", 401)

    @jwt.invalid_token_loader
    def _invalid(reason):
        return _envelope("Invalid authentication token", "token_invalid", 401)

    @jwt.unauthorized_loader
    def _missing(reason):
        return _envelope("Authentication required", "authorization_required", 401)

    @jwt.revoked_token_loader
    def _revoked(_h, _p):
        return _envelope("This token has been revoked", "token_revoked", 401)

"""
Shared error envelope.

AGREED IN PHASE 0 - do not change unilaterally. Every error response
returned by either developer has exactly this shape:

    {"error": {"code": "not_found",
               "message": "Customer not found",
               "details": {}}}

The frontend reads error.code to branch, error.message to display, and
error.details for per-field validation messages.
"""
from flask import jsonify
from marshmallow import ValidationError


class ApiError(Exception):
    """Base class for every error we raise deliberately."""

    status_code = 400
    code = "bad_request"

    def __init__(self, message, status_code=None, code=None, details=None):
        super().__init__(message)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        if code is not None:
            self.code = code
        self.details = details or {}

    def to_response(self):
        payload = {
            "error": {
                "code": self.code,
                "message": self.message,
                "details": self.details,
            }
        }
        return jsonify(payload), self.status_code


class BadRequest(ApiError):
    status_code = 400
    code = "bad_request"


class Unauthorized(ApiError):
    status_code = 401
    code = "unauthorized"


class Forbidden(ApiError):
    status_code = 403
    code = "forbidden"


class NotFound(ApiError):
    status_code = 404
    code = "not_found"


class Conflict(ApiError):
    status_code = 409
    code = "conflict"


class Unprocessable(ApiError):
    status_code = 422
    code = "unprocessable_entity"


def register_error_handlers(app):
    """Call this inside create_app() - Phase 0 wiring."""

    @app.errorhandler(ApiError)
    def _handle_api_error(err):
        return err.to_response()

    @app.errorhandler(ValidationError)
    def _handle_marshmallow(err):
        return ApiError(
            "Validation failed", 422, "validation_error", err.messages
        ).to_response()

    @app.errorhandler(404)
    def _handle_404(err):
        return NotFound("Resource not found").to_response()

    @app.errorhandler(405)
    def _handle_405(err):
        return ApiError(
            "Method not allowed for this endpoint", 405, "method_not_allowed"
        ).to_response()

    @app.errorhandler(500)
    def _handle_500(err):
        from app.extensions import db

        db.session.rollback()
        return ApiError(
            "An unexpected error occurred", 500, "internal_error"
        ).to_response()

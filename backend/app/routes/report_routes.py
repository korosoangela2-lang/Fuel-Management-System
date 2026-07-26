"""Reporting and dashboard endpoints. Base path /api/reports."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from marshmallow import Schema, fields

from app.services import report_service
from app.services.inventory_seam import inventory_report
from app.utils.errors import Forbidden
from app.utils.scoping import (
    ADMIN_ROLES,
    ROLE_REGIONAL_ADMIN,
    ROLE_SUPER_ADMIN,
    current_identity,
    current_region_id,
    is_super_admin,
    role_required,
)

report_bp = Blueprint("reports", __name__, url_prefix="/api/reports")


class DateRangeSchema(Schema):
    start_date = fields.Date()
    end_date = fields.Date()


date_range_schema = DateRangeSchema()


def _report_region():
    """
    Which region a report covers.

    A regional admin always gets their own. A super admin defaults to the
    consolidated view but may narrow to one region with ?region_id=.
    """
    if is_super_admin():
        return request.args.get("region_id", type=int)  # None == all regions
    return current_region_id()


@report_bp.get("/dashboard")
@jwt_required()
def dashboard():
    identity = current_identity()
    return jsonify(
        report_service.dashboard_stats(
            region_id=_report_region(),
            user_id=identity["user_id"],
            is_admin=identity["role"] in ADMIN_ROLES,
        )
    ), 200


@report_bp.get("/inventory")
@jwt_required()
def inventory():
    """Delegates to Dev A's inventory service through the seam."""
    return jsonify(inventory_report(_report_region())), 200


@report_bp.get("/sales")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def sales():
    filters = date_range_schema.load(request.args.to_dict(), partial=True)
    return jsonify(
        report_service.sales_report(
            _report_region(), filters.get("start_date"), filters.get("end_date")
        )
    ), 200


@report_bp.get("/revenue")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def revenue():
    filters = date_range_schema.load(request.args.to_dict(), partial=True)
    return jsonify(
        report_service.revenue_summary(
            _report_region(), filters.get("start_date"), filters.get("end_date")
        )
    ), 200


@report_bp.get("/deliveries")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def deliveries():
    return jsonify(report_service.delivery_report(_report_region())), 200


@report_bp.get("/top-customers")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def customers():
    limit = min(request.args.get("limit", 5, type=int), 50)
    return jsonify(
        {"top_customers": report_service.top_customers(_report_region(), limit)}
    ), 200


@report_bp.get("/consolidated")
@jwt_required()
@role_required(ROLE_SUPER_ADMIN)
def consolidated():
    """Cross-region comparison. Super administrator only."""
    if not is_super_admin():
        raise Forbidden("Only the super administrator can view consolidated reports")
    return jsonify(report_service.consolidated_report()), 200

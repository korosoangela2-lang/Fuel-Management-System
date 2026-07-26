"""Customer endpoints. Base path /api/customers."""
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models.customer import Customer
from app.schemas.customer_schema import (
    customer_create_schema,
    customer_schema,
    customer_update_schema,
    customers_schema,
)
from app.utils.errors import Conflict
from app.utils.pagination import paginate
from app.utils.scoping import (
    ROLE_REGIONAL_ADMIN,
    current_identity,
    get_or_404,
    resolve_region_for_write,
    role_required,
    scope_to_region,
)

customer_bp = Blueprint("customers", __name__, url_prefix="/api/customers")


@customer_bp.get("")
@jwt_required()
def list_customers():
    query = scope_to_region(Customer.query, Customer)

    search = request.args.get("search", type=str)
    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Customer.name.ilike(term),
                Customer.email.ilike(term),
                Customer.phone.ilike(term),
            )
        )

    if request.args.get("customer_type"):
        query = query.filter(Customer.customer_type == request.args["customer_type"])

    active = request.args.get("is_active")
    if active is not None:
        query = query.filter(Customer.is_active.is_(active.lower() == "true"))

    query = query.order_by(Customer.name.asc())
    return jsonify(paginate(query, customers_schema)), 200


@customer_bp.get("/<int:customer_id>")
@jwt_required()
def get_customer(customer_id):
    customer = get_or_404(Customer, customer_id)
    return jsonify(customer_schema.dump(customer)), 200


@customer_bp.post("")
@jwt_required()
def create_customer():
    data = customer_create_schema.load(request.get_json() or {})
    identity = current_identity()

    customer = Customer(
        name=data["name"],
        email=data.get("email"),
        phone=data["phone"],
        address=data.get("address"),
        customer_type=data["customer_type"],
        credit_limit=data["credit_limit"],
        region_id=resolve_region_for_write(data.get("region_id")),
        created_by_id=identity["user_id"],
    )

    db.session.add(customer)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise Conflict("A customer with this phone number or email already exists in your region")

    return jsonify(customer_schema.dump(customer)), 201


@customer_bp.patch("/<int:customer_id>")
@jwt_required()
def update_customer(customer_id):
    customer = get_or_404(Customer, customer_id)
    data = customer_update_schema.load(request.get_json() or {})

    # region_id is never writable through this route.
    data.pop("region_id", None)
    for field, value in data.items():
        setattr(customer, field, value)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise Conflict("Another customer in your region already uses this phone number or email")

    return jsonify(customer_schema.dump(customer)), 200


@customer_bp.delete("/<int:customer_id>")
@jwt_required()
@role_required(ROLE_REGIONAL_ADMIN)
def deactivate_customer(customer_id):
    """
    Soft delete. A hard delete would orphan the customer's order history and
    make past regional revenue reports unreproducible.
    """
    customer = get_or_404(Customer, customer_id)
    customer.is_active = False
    db.session.commit()
    return jsonify({"message": "Customer deactivated", "id": customer.id}), 200

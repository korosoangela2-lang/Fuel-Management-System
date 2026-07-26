"""
Test fixtures for the Dev B slice.

Tokens are minted directly rather than by hitting a login route, so these
tests do not depend on Dev A's auth blueprint. The claims written here —
role and region_id — are the Phase 0 contract; if Dev A's login writes
different key names, these tests are where you will find out.
"""
from datetime import date
from decimal import Decimal

import pytest
from flask_jwt_extended import create_access_token

from app import create_app
from app.extensions import db
from app.models import Customer, Fuel, Order, OrderItem, Region, User
from app.models.distribution import DeliveryStatus, Distribution
from app.models.order import OrderStatus


@pytest.fixture
def app():
    application = create_app("config.TestingConfig")
    ctx = application.app_context()
    ctx.push()
    db.create_all()
    yield application
    db.session.remove()
    db.drop_all()
    ctx.pop()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def auth_header(app):
    def _make(user):
        token = create_access_token(
            identity=str(user.id),
            additional_claims={"role": user.role, "region_id": user.region_id},
        )
        return {"Authorization": f"Bearer {token}"}

    return _make


# --------------------------------------------------------------------------
# Regions
# --------------------------------------------------------------------------
@pytest.fixture
def nairobi_region(app):
    region = Region(name="Nairobi", code="NRB")
    db.session.add(region)
    db.session.commit()
    return region


@pytest.fixture
def mombasa_region(app):
    region = Region(name="Mombasa", code="MSA")
    db.session.add(region)
    db.session.commit()
    return region


# --------------------------------------------------------------------------
# Users
# --------------------------------------------------------------------------
def _make_user(username, role, region_id):
    user = User(
        username=username,
        email=f"{username}@fuelco.co.ke",
        role=role,
        region_id=region_id,
    )
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def nairobi_user(nairobi_region):
    return _make_user("nrb_staff", "user", nairobi_region.id)


@pytest.fixture
def nairobi_admin(nairobi_region):
    return _make_user("nrb_admin", "regional_admin", nairobi_region.id)


@pytest.fixture
def mombasa_admin(mombasa_region):
    return _make_user("msa_admin", "regional_admin", mombasa_region.id)


@pytest.fixture
def super_admin(app):
    return _make_user("root", "super_admin", None)


# --------------------------------------------------------------------------
# Fuel stock
# --------------------------------------------------------------------------
def _make_fuel(name, region_id, price="185.50", qty="10000"):
    fuel = Fuel(
        name=name,
        unit_price=Decimal(price),
        quantity_available=Decimal(qty),
        region_id=region_id,
    )
    db.session.add(fuel)
    db.session.commit()
    return fuel


@pytest.fixture
def nairobi_fuel(nairobi_region):
    return _make_fuel("Diesel (Nairobi)", nairobi_region.id)


@pytest.fixture
def mombasa_fuel(mombasa_region):
    return _make_fuel("Diesel (Mombasa)", mombasa_region.id)


# --------------------------------------------------------------------------
# Customers
# --------------------------------------------------------------------------
def _make_customer(name, phone, region_id):
    customer = Customer(name=name, phone=phone, region_id=region_id)
    db.session.add(customer)
    db.session.commit()
    return customer


@pytest.fixture
def nairobi_customer(nairobi_region):
    return _make_customer("Westlands Transporters", "0711000001", nairobi_region.id)


@pytest.fixture
def mombasa_customer(mombasa_region):
    return _make_customer("Likoni Haulage", "0722000002", mombasa_region.id)


# --------------------------------------------------------------------------
# Orders
# --------------------------------------------------------------------------
def _make_order(customer, fuel, user, status=OrderStatus.PENDING, quantity="500"):
    order = Order(
        order_number=f"ORD-TEST-{customer.id}-{status.value}",
        customer_id=customer.id,
        region_id=customer.region_id,
        created_by_id=user.id,
        status=status,
    )
    item = OrderItem(
        fuel_id=fuel.id,
        quantity=Decimal(quantity),
        unit_price=Decimal(str(fuel.unit_price)),
    )
    item.compute_line_total()
    order.items.append(item)
    order.recalculate_total()
    db.session.add(order)
    db.session.commit()
    return order


@pytest.fixture
def nairobi_order(nairobi_customer, nairobi_fuel, nairobi_user):
    return _make_order(nairobi_customer, nairobi_fuel, nairobi_user)


@pytest.fixture
def approved_nairobi_order(nairobi_customer, nairobi_fuel, nairobi_user):
    return _make_order(
        nairobi_customer, nairobi_fuel, nairobi_user, status=OrderStatus.APPROVED
    )


@pytest.fixture
def mombasa_order(mombasa_customer, mombasa_fuel, mombasa_admin):
    return _make_order(mombasa_customer, mombasa_fuel, mombasa_admin)


# --------------------------------------------------------------------------
# Deliveries
# --------------------------------------------------------------------------
@pytest.fixture
def pending_delivery(approved_nairobi_order, nairobi_admin):
    delivery = Distribution(
        order_id=approved_nairobi_order.id,
        region_id=approved_nairobi_order.region_id,
        vehicle_registration="KDA123X",
        driver_name="James Mwangi",
        driver_phone="0722000000",
        scheduled_date=date(2026, 8, 1),
        status=DeliveryStatus.PENDING,
        scheduled_by_id=nairobi_admin.id,
    )
    db.session.add(delivery)
    db.session.commit()
    return delivery

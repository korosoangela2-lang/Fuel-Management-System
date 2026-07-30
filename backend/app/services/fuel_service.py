"""
Fuel inventory service — Dev A.

Owns the four functions Dev B's inventory_seam imports. Once this module
exists, inventory_seam's try-import resolves to these and its fallbacks are
never touched. The signatures are the Phase 0 contract:

    check_availability(fuel_id, quantity, region_id) -> bool
    deduct_stock(fuel_id, quantity, region_id)       -> None
    get_fuel_snapshot(fuel_id, region_id)            -> dict | None
    inventory_report(region_id)                      -> dict

deduct_stock does NOT commit — the caller (Dev B's delivery flow) owns the
transaction so the stock change and the order status change land together.
"""
from decimal import Decimal

from app.extensions import db
from app.models.fuel import Fuel


def _fuel_in_region(fuel_id, region_id):
    return Fuel.query.filter(
        Fuel.id == fuel_id, Fuel.region_id == region_id
    ).one_or_none()


def get_fuel_snapshot(fuel_id, region_id):
    fuel = _fuel_in_region(fuel_id, region_id)
    if fuel is None:
        return None
    return {
        "id": fuel.id,
        "name": fuel.name,
        "unit_price": Decimal(str(fuel.unit_price)),
        "quantity_available": Decimal(str(fuel.quantity_available)),
        "unit_of_measure": fuel.unit_of_measure,
    }


def check_availability(fuel_id, quantity, region_id):
    fuel = _fuel_in_region(fuel_id, region_id)
    if fuel is None:
        return False
    return Decimal(str(fuel.quantity_available)) >= Decimal(str(quantity))


def deduct_stock(fuel_id, quantity, region_id):
    # SELECT ... FOR UPDATE serialises concurrent deliveries against the same
    # product on Postgres. SQLite ignores it, which is fine for dev/tests.
    fuel = (
        Fuel.query.filter(Fuel.id == fuel_id, Fuel.region_id == region_id)
        .with_for_update(read=False)
        .one_or_none()
    )
    if fuel is None:
        raise ValueError(f"Fuel {fuel_id} not found in region {region_id}")

    new_qty = Decimal(str(fuel.quantity_available)) - Decimal(str(quantity))
    if new_qty < 0:
        raise ValueError(
            f"Deduction would drive {fuel.name} below zero "
            f"(have {fuel.quantity_available}, deducting {quantity})"
        )
    fuel.quantity_available = new_qty
    db.session.add(fuel)


def add_stock(fuel_id, quantity, region_id):
    """Replenishment — the inverse of deduct_stock. Commits on its own."""
    fuel = _fuel_in_region(fuel_id, region_id)
    if fuel is None:
        raise ValueError(f"Fuel {fuel_id} not found in region {region_id}")
    fuel.quantity_available = Decimal(str(fuel.quantity_available)) + Decimal(str(quantity))
    db.session.add(fuel)
    db.session.commit()
    return fuel


def inventory_report(region_id):
    query = Fuel.query.filter(Fuel.is_active.is_(True))
    if region_id is not None:
        query = query.filter(Fuel.region_id == region_id)
    products = query.all()

    total = sum(
        (Decimal(str(p.quantity_available)) for p in products), Decimal("0")
    )
    return {
        "region_id": region_id,
        "product_count": len(products),
        "total_stock": str(total),
        "low_stock_count": sum(1 for p in products if p.is_low_stock),
        "products": [
            {
                "id": p.id,
                "name": p.name,
                "fuel_type": p.fuel_type,
                "quantity_available": str(p.quantity_available),
                "unit_price": str(p.unit_price),
                "unit_of_measure": p.unit_of_measure,
                "is_low_stock": p.is_low_stock,
            }
            for p in products
        ],
    }

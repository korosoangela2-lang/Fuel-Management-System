"""
THE SEAM between Dev A (inventory) and Dev B (orders, deliveries, reports).

Dev A owns the real implementations in app/services/fuel_service.py. Dev B
imports only from this module, so when Dev A merges, nothing in Dev B's code
changes - the try/except below simply starts resolving.

Agreed signatures:

    check_availability(fuel_id, quantity, region_id) -> bool
    deduct_stock(fuel_id, quantity, region_id)       -> None
    inventory_report(region_id)                      -> dict
    get_fuel_snapshot(fuel_id, region_id)            -> dict | None

get_fuel_snapshot is the one addition to the three signatures agreed in the
kickoff: orders must store the unit price as it stood at the time of ordering,
otherwise a later price change silently rewrites historical revenue. It returns
{"id", "name", "unit_price", "quantity_available", "unit_of_measure"}.
"""
from decimal import Decimal

try:  # pragma: no cover - resolves once Dev A merges
    from app.services.fuel_service import (  # noqa: F401
        check_availability,
        deduct_stock,
        get_fuel_snapshot,
        inventory_report,
    )
except ImportError:
    # ---------------------------------------------------------------
    # Temporary fallbacks. Delete this whole block when Dev A merges.
    # They read the shared Fuel model directly, using the column names
    # frozen in Phase 0: id, name, unit_price, quantity_available,
    # unit_of_measure, region_id.
    # ---------------------------------------------------------------
    from app.extensions import db

    def _fuel_model():
        # Resolve through the registry, not app.models.fuel directly: before
        # Dev A merges, Fuel is the placeholder, and a hard import of their
        # module path fails at runtime rather than at boot.
        from app.models import Fuel

        return Fuel

    def get_fuel_snapshot(fuel_id, region_id):
        Fuel = _fuel_model()
        fuel = (
            Fuel.query.filter(Fuel.id == fuel_id, Fuel.region_id == region_id)
            .one_or_none()
        )
        if fuel is None:
            return None
        return {
            "id": fuel.id,
            "name": fuel.name,
            "unit_price": Decimal(str(fuel.unit_price)),
            "quantity_available": Decimal(str(fuel.quantity_available)),
            "unit_of_measure": getattr(fuel, "unit_of_measure", "litres"),
        }

    def check_availability(fuel_id, quantity, region_id):
        snapshot = get_fuel_snapshot(fuel_id, region_id)
        if snapshot is None:
            return False
        return snapshot["quantity_available"] >= Decimal(str(quantity))

    def deduct_stock(fuel_id, quantity, region_id):
        Fuel = _fuel_model()
        fuel = (
            Fuel.query.filter(Fuel.id == fuel_id, Fuel.region_id == region_id)
            .with_for_update(read=False)
            .one_or_none()
        )
        if fuel is None:
            raise ValueError(f"Fuel {fuel_id} not found in region {region_id}")
        fuel.quantity_available = Decimal(str(fuel.quantity_available)) - Decimal(
            str(quantity)
        )
        db.session.add(fuel)

    def inventory_report(region_id):
        Fuel = _fuel_model()
        query = Fuel.query
        if region_id is not None:
            query = query.filter(Fuel.region_id == region_id)
        products = query.all()
        return {
            "product_count": len(products),
            "total_stock": str(
                sum((Decimal(str(p.quantity_available)) for p in products), Decimal("0"))
            ),
            "products": [
                {
                    "id": p.id,
                    "name": p.name,
                    "quantity_available": str(p.quantity_available),
                    "unit_price": str(p.unit_price),
                }
                for p in products
            ],
        }

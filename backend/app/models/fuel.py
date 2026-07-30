"""
Fuel inventory model — Dev A.

Column names are the Phase 0 contract the seam depends on:
    id, name, unit_price, quantity_available, unit_of_measure, region_id
Change any of them and Dev B's inventory_seam fallbacks break.
"""
from app.extensions import db
from app.utils.timeutils import utcnow


class Fuel(db.Model):
    __tablename__ = "fuels"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    fuel_type = db.Column(db.String(40))  # petrol, diesel, kerosene, jet a1
    unit_price = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    quantity_available = db.Column(db.Numeric(14, 2), nullable=False, default=0)
    unit_of_measure = db.Column(db.String(20), nullable=False, default="litres")
    reorder_level = db.Column(db.Numeric(14, 2), nullable=False, default=0)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    # Inventory is held per region: Nairobi diesel is tracked separately
    # from Mombasa diesel.
    region_id = db.Column(
        db.Integer, db.ForeignKey("regions.id"), nullable=False, index=True
    )
    refinery_id = db.Column(db.Integer, db.ForeignKey("refineries.id"))

    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=utcnow, onupdate=utcnow
    )

    region = db.relationship("Region", backref=db.backref("fuels", lazy="dynamic"))
    refinery = db.relationship("Refinery", back_populates="fuels")

    __table_args__ = (
        db.Index("ix_fuel_region_name", "region_id", "name"),
        db.CheckConstraint("quantity_available >= 0", name="ck_fuel_qty_non_negative"),
    )

    @property
    def is_low_stock(self):
        return self.quantity_available <= self.reorder_level

    def __repr__(self):
        return f"<Fuel {self.name} region={self.region_id} qty={self.quantity_available}>"

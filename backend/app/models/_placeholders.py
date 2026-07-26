"""
TEMPORARY placeholder models — Dev A owns the real versions.

Dev B's foreign keys point at regions.id, users.id and fuels.id, and the
relationships resolve "Region", "User" and "Fuel" by name. Without these
tables the mappers cannot configure and nothing in Dev B's slice runs.

The columns below are the Phase 0 contract, nothing more. Delete this file
the moment Dev A merges — app/models/__init__.py falls back to it only when
the real modules are absent.
"""
from app.extensions import db


class Region(db.Model):
    __tablename__ = "regions"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False, unique=True)
    code = db.Column(db.String(10), nullable=False, unique=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False, default="")
    role = db.Column(db.String(30), nullable=False, default="user")
    # Nullable: the super administrator belongs to no single region.
    region_id = db.Column(db.Integer, db.ForeignKey("regions.id"))
    is_active = db.Column(db.Boolean, nullable=False, default=True)


class Fuel(db.Model):
    __tablename__ = "fuels"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    unit_price = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    quantity_available = db.Column(db.Numeric(14, 2), nullable=False, default=0)
    unit_of_measure = db.Column(db.String(20), nullable=False, default="litres")
    region_id = db.Column(
        db.Integer, db.ForeignKey("regions.id"), nullable=False, index=True
    )

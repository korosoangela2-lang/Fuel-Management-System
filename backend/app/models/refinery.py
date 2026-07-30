"""Refinery / depot model — Dev A. Identifies where stock physically sits."""
from app.extensions import db
from app.utils.timeutils import utcnow


class Refinery(db.Model):
    __tablename__ = "refineries"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(200))
    capacity = db.Column(db.Numeric(14, 2), nullable=False, default=0)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    region_id = db.Column(
        db.Integer, db.ForeignKey("regions.id"), nullable=False, index=True
    )

    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=utcnow, onupdate=utcnow
    )

    region = db.relationship("Region", backref=db.backref("refineries", lazy="dynamic"))
    fuels = db.relationship("Fuel", back_populates="refinery", lazy="dynamic")

    def __repr__(self):
        return f"<Refinery {self.name} region={self.region_id}>"

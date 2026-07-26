"""Customer model. Owned by Dev B, frozen after Phase 0."""
from app.utils.timeutils import utcnow

from app.extensions import db


class CustomerType:
    INDIVIDUAL = "individual"
    CORPORATE = "corporate"
    GOVERNMENT = "government"

    ALL = (INDIVIDUAL, CORPORATE, GOVERNMENT)


class Customer(db.Model):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, index=True)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(30), nullable=False)
    address = db.Column(db.String(255))
    customer_type = db.Column(
        db.String(20), nullable=False, default=CustomerType.INDIVIDUAL
    )
    credit_limit = db.Column(db.Numeric(12, 2), nullable=False, default=0)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    # Customers are registered under the branch that serves them.
    region_id = db.Column(
        db.Integer, db.ForeignKey("regions.id"), nullable=False, index=True
    )
    created_by_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=utcnow, onupdate=utcnow
    )

    orders = db.relationship("Order", back_populates="customer", lazy="dynamic")
    region = db.relationship("Region", backref=db.backref("customers", lazy="dynamic"))

    __table_args__ = (
        # Duplicate prevention is scoped to the region: the same corporate
        # client may legitimately be served by two branches.
        db.UniqueConstraint("region_id", "phone", name="uq_customer_region_phone"),
        db.UniqueConstraint("region_id", "email", name="uq_customer_region_email"),
        db.Index("ix_customer_region_name", "region_id", "name"),
    )

    def __repr__(self):
        return f"<Customer {self.id} {self.name} region={self.region_id}>"

"""Distribution / delivery tracking. Region is inherited from the parent order."""
import enum
from app.utils.timeutils import utcnow

from app.extensions import db


class DeliveryStatus(str, enum.Enum):
    PENDING = "pending"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    FAILED = "failed"


DELIVERY_TRANSITIONS = {
    DeliveryStatus.PENDING: {DeliveryStatus.IN_TRANSIT, DeliveryStatus.FAILED},
    DeliveryStatus.IN_TRANSIT: {DeliveryStatus.DELIVERED, DeliveryStatus.FAILED},
    DeliveryStatus.DELIVERED: set(),
    # A failed delivery can be rescheduled rather than re-created, so the
    # order keeps a single delivery history.
    DeliveryStatus.FAILED: {DeliveryStatus.PENDING},
}


class Distribution(db.Model):
    __tablename__ = "distributions"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(
        db.Integer,
        db.ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    region_id = db.Column(
        db.Integer, db.ForeignKey("regions.id"), nullable=False, index=True
    )

    vehicle_registration = db.Column(db.String(20), nullable=False)
    driver_name = db.Column(db.String(120), nullable=False)
    driver_phone = db.Column(db.String(30), nullable=False)

    scheduled_date = db.Column(db.Date, nullable=False)
    dispatched_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)

    status = db.Column(
        db.Enum(
            DeliveryStatus,
            name="delivery_status",
            values_callable=lambda e: [m.value for m in e],
        ),
        nullable=False,
        default=DeliveryStatus.PENDING,
        index=True,
    )
    notes = db.Column(db.Text)

    # Idempotency guard. Without it, a client that PATCHes "delivered" twice
    # deducts the stock twice and the regional inventory silently goes wrong.
    stock_deducted = db.Column(db.Boolean, nullable=False, default=False)

    scheduled_by_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=utcnow, onupdate=utcnow
    )

    order = db.relationship("Order", back_populates="distribution")

    __table_args__ = (db.Index("ix_distribution_region_status", "region_id", "status"),)

    def can_transition_to(self, new_status):
        return new_status in DELIVERY_TRANSITIONS[self.status]

    def __repr__(self):
        return f"<Distribution order={self.order_id} {self.status.value}>"

"""
Order and OrderItem.

Orders <-> Fuel Products is many-to-many, but the relationship carries data
(quantity, unit price at time of order), so it is modelled as an association
object rather than a bare join table.
"""
import enum
from app.utils.timeutils import utcnow
from decimal import Decimal

from app.extensions import db


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    CANCELLED = "cancelled"
    FULFILLED = "fulfilled"


# A cancelled or fulfilled order is terminal. Fulfilment is driven by the
# delivery reaching DELIVERED, never set directly through the orders API.
ORDER_TRANSITIONS = {
    OrderStatus.PENDING: {OrderStatus.APPROVED, OrderStatus.CANCELLED},
    OrderStatus.APPROVED: {OrderStatus.FULFILLED, OrderStatus.CANCELLED},
    OrderStatus.CANCELLED: set(),
    OrderStatus.FULFILLED: set(),
}


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(40), nullable=False, unique=True, index=True)

    customer_id = db.Column(
        db.Integer, db.ForeignKey("customers.id"), nullable=False, index=True
    )
    # Stored on the order itself so historical records stay correct even if the
    # customer is later reassigned to another branch.
    region_id = db.Column(
        db.Integer, db.ForeignKey("regions.id"), nullable=False, index=True
    )
    created_by_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    status = db.Column(
        db.Enum(
            OrderStatus,
            name="order_status",
            values_callable=lambda e: [m.value for m in e],
        ),
        nullable=False,
        default=OrderStatus.PENDING,
        index=True,
    )
    total_amount = db.Column(db.Numeric(14, 2), nullable=False, default=0)
    delivery_address = db.Column(db.String(255))
    notes = db.Column(db.Text)

    approved_by_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    approved_at = db.Column(db.DateTime)
    cancelled_at = db.Column(db.DateTime)
    cancellation_reason = db.Column(db.String(255))

    created_at = db.Column(db.DateTime, nullable=False, default=utcnow, index=True)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=utcnow, onupdate=utcnow
    )

    customer = db.relationship("Customer", back_populates="orders")
    items = db.relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    distribution = db.relationship(
        "Distribution",
        back_populates="order",
        uselist=False,
        cascade="all, delete-orphan",
    )

    __table_args__ = (db.Index("ix_order_region_status", "region_id", "status"),)

    def recalculate_total(self):
        self.total_amount = sum(
            (item.line_total for item in self.items), Decimal("0.00")
        )
        return self.total_amount

    def can_transition_to(self, new_status):
        return new_status in ORDER_TRANSITIONS[self.status]

    @property
    def is_editable(self):
        """Line items may only be changed while the order is still pending."""
        return self.status == OrderStatus.PENDING

    def __repr__(self):
        return f"<Order {self.order_number} {self.status.value} region={self.region_id}>"


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(
        db.Integer, db.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False
    )
    fuel_id = db.Column(db.Integer, db.ForeignKey("fuels.id"), nullable=False)

    quantity = db.Column(db.Numeric(12, 2), nullable=False)
    # Price is snapshotted at order time. Reading it live off the Fuel row would
    # let a later price change rewrite last month's revenue figures.
    unit_price = db.Column(db.Numeric(12, 2), nullable=False)
    line_total = db.Column(db.Numeric(14, 2), nullable=False)

    order = db.relationship("Order", back_populates="items")
    fuel = db.relationship("Fuel")

    __table_args__ = (
        db.UniqueConstraint("order_id", "fuel_id", name="uq_order_item_fuel"),
        db.CheckConstraint("quantity > 0", name="ck_order_item_quantity_positive"),
    )

    def compute_line_total(self):
        self.line_total = (Decimal(str(self.quantity)) * Decimal(str(self.unit_price))
                           ).quantize(Decimal("0.01"))
        return self.line_total

    def __repr__(self):
        return f"<OrderItem order={self.order_id} fuel={self.fuel_id} qty={self.quantity}>"

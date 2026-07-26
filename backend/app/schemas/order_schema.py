"""Marshmallow schemas for Order and OrderItem."""
from marshmallow import EXCLUDE, Schema, fields, validate

from app.models.order import OrderStatus


class OrderItemSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    fuel_id = fields.Int(dump_only=True)
    fuel_name = fields.Function(
        lambda obj: obj.fuel.name if obj.fuel else None, dump_only=True
    )
    quantity = fields.Decimal(as_string=True, dump_only=True)
    unit_price = fields.Decimal(as_string=True, dump_only=True)
    line_total = fields.Decimal(as_string=True, dump_only=True)


class OrderSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    order_number = fields.Str(dump_only=True)
    customer_id = fields.Int(dump_only=True)
    customer_name = fields.Function(
        lambda obj: obj.customer.name if obj.customer else None, dump_only=True
    )
    region_id = fields.Int(dump_only=True)
    created_by_id = fields.Int(dump_only=True)
    status = fields.Function(lambda obj: obj.status.value, dump_only=True)
    total_amount = fields.Decimal(as_string=True, dump_only=True)
    delivery_address = fields.Str(allow_none=True)
    notes = fields.Str(allow_none=True)
    approved_by_id = fields.Int(dump_only=True, allow_none=True)
    approved_at = fields.DateTime(dump_only=True, allow_none=True)
    cancelled_at = fields.DateTime(dump_only=True, allow_none=True)
    cancellation_reason = fields.Str(dump_only=True, allow_none=True)
    items = fields.List(fields.Nested(OrderItemSchema), dump_only=True)
    delivery_status = fields.Function(
        lambda obj: obj.distribution.status.value if obj.distribution else None,
        dump_only=True,
    )
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


class OrderItemInputSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    fuel_id = fields.Int(required=True)
    quantity = fields.Decimal(
        required=True, as_string=True, validate=validate.Range(min=0, min_inclusive=False)
    )


class OrderCreateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    customer_id = fields.Int(required=True)
    items = fields.List(
        fields.Nested(OrderItemInputSchema),
        required=True,
        validate=validate.Length(min=1),
    )
    delivery_address = fields.Str(allow_none=True, load_default=None,
                                  validate=validate.Length(max=255))
    notes = fields.Str(allow_none=True, load_default=None)
    region_id = fields.Int(load_default=None)  # super admin only


class OrderUpdateSchema(Schema):
    """Only permitted while the order is still pending."""

    class Meta:
        unknown = EXCLUDE

    items = fields.List(
        fields.Nested(OrderItemInputSchema), validate=validate.Length(min=1)
    )
    delivery_address = fields.Str(allow_none=True, validate=validate.Length(max=255))
    notes = fields.Str(allow_none=True)


class OrderCancelSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    reason = fields.Str(required=True, validate=validate.Length(min=3, max=255))


class OrderQuerySchema(Schema):
    """Filters accepted on GET /api/orders."""

    class Meta:
        unknown = EXCLUDE

    status = fields.Str(validate=validate.OneOf([s.value for s in OrderStatus]))
    customer_id = fields.Int()
    start_date = fields.Date()
    end_date = fields.Date()
    search = fields.Str()


order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
order_create_schema = OrderCreateSchema()
order_update_schema = OrderUpdateSchema()
order_cancel_schema = OrderCancelSchema()
order_query_schema = OrderQuerySchema()

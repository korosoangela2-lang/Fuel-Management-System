"""Marshmallow schemas for Distribution."""
from marshmallow import EXCLUDE, Schema, fields, validate

from app.models.distribution import DeliveryStatus


class DistributionSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    order_id = fields.Int(dump_only=True)
    order_number = fields.Function(
        lambda obj: obj.order.order_number if obj.order else None, dump_only=True
    )
    customer_name = fields.Function(
        lambda obj: obj.order.customer.name if obj.order and obj.order.customer else None,
        dump_only=True,
    )
    region_id = fields.Int(dump_only=True)
    vehicle_registration = fields.Str()
    driver_name = fields.Str()
    driver_phone = fields.Str()
    scheduled_date = fields.Date()
    dispatched_at = fields.DateTime(dump_only=True, allow_none=True)
    delivered_at = fields.DateTime(dump_only=True, allow_none=True)
    status = fields.Function(lambda obj: obj.status.value, dump_only=True)
    notes = fields.Str(allow_none=True)
    stock_deducted = fields.Bool(dump_only=True)
    created_at = fields.DateTime(dump_only=True)


class DistributionCreateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    order_id = fields.Int(required=True)
    vehicle_registration = fields.Str(
        required=True, validate=validate.Length(min=4, max=20)
    )
    driver_name = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    driver_phone = fields.Str(required=True, validate=validate.Length(min=7, max=30))
    scheduled_date = fields.Date(required=True)
    notes = fields.Str(allow_none=True, load_default=None)


class DistributionUpdateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    vehicle_registration = fields.Str(validate=validate.Length(min=4, max=20))
    driver_name = fields.Str(validate=validate.Length(min=2, max=120))
    driver_phone = fields.Str(validate=validate.Length(min=7, max=30))
    scheduled_date = fields.Date()
    notes = fields.Str(allow_none=True)


class DistributionStatusSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    status = fields.Str(
        required=True, validate=validate.OneOf([s.value for s in DeliveryStatus])
    )
    notes = fields.Str(allow_none=True, load_default=None)


distribution_schema = DistributionSchema()
distributions_schema = DistributionSchema(many=True)
distribution_create_schema = DistributionCreateSchema()
distribution_update_schema = DistributionUpdateSchema(partial=True)
distribution_status_schema = DistributionStatusSchema()

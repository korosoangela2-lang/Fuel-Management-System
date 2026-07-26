"""Marshmallow schemas for Customer."""
from marshmallow import EXCLUDE, Schema, fields, validate

from app.models.customer import CustomerType


class CustomerSchema(Schema):
    """Output. region_id is dump-only everywhere - it comes from the token."""

    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    name = fields.Str()
    email = fields.Email(allow_none=True)
    phone = fields.Str()
    address = fields.Str(allow_none=True)
    customer_type = fields.Str()
    credit_limit = fields.Decimal(as_string=True)
    is_active = fields.Bool()
    region_id = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    order_count = fields.Method("get_order_count", dump_only=True)

    def get_order_count(self, obj):
        return obj.orders.count()


class CustomerCreateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    name = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(allow_none=True, load_default=None)
    phone = fields.Str(required=True, validate=validate.Length(min=7, max=30))
    address = fields.Str(allow_none=True, load_default=None,
                         validate=validate.Length(max=255))
    customer_type = fields.Str(
        load_default=CustomerType.INDIVIDUAL,
        validate=validate.OneOf(CustomerType.ALL),
    )
    credit_limit = fields.Decimal(
        load_default=0, validate=validate.Range(min=0), as_string=True
    )
    # Accepted only from a super admin, who has no region of their own.
    # resolve_region_for_write() ignores it for everyone else.
    region_id = fields.Int(load_default=None)


class CustomerUpdateSchema(CustomerCreateSchema):
    name = fields.Str(validate=validate.Length(min=2, max=120))
    phone = fields.Str(validate=validate.Length(min=7, max=30))
    is_active = fields.Bool()


customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)
customer_create_schema = CustomerCreateSchema()
customer_update_schema = CustomerUpdateSchema(partial=True)

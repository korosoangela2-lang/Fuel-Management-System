"""Refinery schemas — Dev A."""
from marshmallow import EXCLUDE, Schema, fields, validate


class RefinerySchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    name = fields.Str()
    location = fields.Str(allow_none=True)
    capacity = fields.Decimal(as_string=True)
    is_active = fields.Bool()
    region_id = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)


class RefineryCreateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    name = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    location = fields.Str(allow_none=True, load_default=None)
    capacity = fields.Decimal(load_default=0, as_string=True,
                              validate=validate.Range(min=0))
    region_id = fields.Int(load_default=None)  # super admin only


class RefineryUpdateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    name = fields.Str(validate=validate.Length(min=2, max=120))
    location = fields.Str(allow_none=True)
    capacity = fields.Decimal(as_string=True, validate=validate.Range(min=0))
    is_active = fields.Bool()


refinery_schema = RefinerySchema()
refineries_schema = RefinerySchema(many=True)
refinery_create_schema = RefineryCreateSchema()
refinery_update_schema = RefineryUpdateSchema(partial=True)

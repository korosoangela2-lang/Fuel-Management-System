"""Fuel schemas — Dev A."""
from marshmallow import EXCLUDE, Schema, fields, validate


class FuelSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    name = fields.Str()
    fuel_type = fields.Str(allow_none=True)
    unit_price = fields.Decimal(as_string=True)
    quantity_available = fields.Decimal(as_string=True)
    unit_of_measure = fields.Str()
    reorder_level = fields.Decimal(as_string=True)
    is_active = fields.Bool()
    is_low_stock = fields.Bool(dump_only=True)
    region_id = fields.Int(dump_only=True)
    refinery_id = fields.Int(allow_none=True)
    created_at = fields.DateTime(dump_only=True)


class FuelCreateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    name = fields.Str(required=True, validate=validate.Length(min=2, max=80))
    fuel_type = fields.Str(allow_none=True, load_default=None)
    unit_price = fields.Decimal(required=True, as_string=True,
                                validate=validate.Range(min=0))
    quantity_available = fields.Decimal(load_default=0, as_string=True,
                                        validate=validate.Range(min=0))
    unit_of_measure = fields.Str(load_default="litres")
    reorder_level = fields.Decimal(load_default=0, as_string=True,
                                   validate=validate.Range(min=0))
    refinery_id = fields.Int(allow_none=True, load_default=None)
    region_id = fields.Int(load_default=None)  # super admin only


class FuelUpdateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    name = fields.Str(validate=validate.Length(min=2, max=80))
    fuel_type = fields.Str(allow_none=True)
    unit_price = fields.Decimal(as_string=True, validate=validate.Range(min=0))
    unit_of_measure = fields.Str()
    reorder_level = fields.Decimal(as_string=True, validate=validate.Range(min=0))
    refinery_id = fields.Int(allow_none=True)
    is_active = fields.Bool()


class StockAdjustSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    quantity = fields.Decimal(
        required=True, as_string=True, validate=validate.Range(min=0, min_inclusive=False)
    )


fuel_schema = FuelSchema()
fuels_schema = FuelSchema(many=True)
fuel_create_schema = FuelCreateSchema()
fuel_update_schema = FuelUpdateSchema(partial=True)
stock_adjust_schema = StockAdjustSchema()

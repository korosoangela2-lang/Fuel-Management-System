"""Region schemas — Dev A."""
from marshmallow import EXCLUDE, Schema, fields, validate


class RegionSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    name = fields.Str()
    code = fields.Str()
    is_active = fields.Bool()
    created_at = fields.DateTime(dump_only=True)
    user_count = fields.Method("count_users", dump_only=True)

    def count_users(self, obj):
        return obj.users.count()


class RegionCreateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    name = fields.Str(required=True, validate=validate.Length(min=2, max=80))
    code = fields.Str(required=True, validate=validate.Length(min=2, max=10))


class RegionUpdateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    name = fields.Str(validate=validate.Length(min=2, max=80))
    code = fields.Str(validate=validate.Length(min=2, max=10))
    is_active = fields.Bool()


region_schema = RegionSchema()
regions_schema = RegionSchema(many=True)
region_create_schema = RegionCreateSchema()
region_update_schema = RegionUpdateSchema(partial=True)

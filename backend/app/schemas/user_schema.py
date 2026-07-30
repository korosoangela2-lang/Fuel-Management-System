"""User schemas — Dev A."""
from marshmallow import EXCLUDE, Schema, fields, validate

from app.models.user import Role


class UserSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    id = fields.Int(dump_only=True)
    username = fields.Str()
    email = fields.Email()
    role = fields.Str()
    region_id = fields.Int(allow_none=True)
    is_active = fields.Bool()
    created_at = fields.DateTime(dump_only=True)


class UserCreateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    username = fields.Str(required=True, validate=validate.Length(min=3, max=80))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8), load_only=True)
    role = fields.Str(required=True, validate=validate.OneOf(Role.ALL))
    region_id = fields.Int(allow_none=True, load_default=None)


class UserUpdateSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    email = fields.Email()
    role = fields.Str(validate=validate.OneOf(Role.ALL))
    region_id = fields.Int(allow_none=True)
    is_active = fields.Bool()


user_schema = UserSchema()
users_schema = UserSchema(many=True)
user_create_schema = UserCreateSchema()
user_update_schema = UserUpdateSchema(partial=True)

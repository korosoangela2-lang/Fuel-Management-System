"""Auth schemas — Dev A."""
from marshmallow import EXCLUDE, Schema, fields, validate


class RegisterSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    username = fields.Str(required=True, validate=validate.Length(min=3, max=80))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8), load_only=True)
    # Region is selected at registration, as the spec requires.
    region_id = fields.Int(required=True)


class LoginSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)


class PasswordResetRequestSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    email = fields.Email(required=True)


class PasswordResetConfirmSchema(Schema):
    class Meta:
        unknown = EXCLUDE

    token = fields.Str(required=True)
    new_password = fields.Str(
        required=True, validate=validate.Length(min=8), load_only=True
    )

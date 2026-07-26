"""
Region scoping and role gating.

OWNERSHIP: Dev A owns the canonical version of this module. What follows is a
complete working implementation so Dev B is never blocked - when Dev A merges
their version, delete this file and keep the import paths identical.

The contract Dev B codes against, agreed Phase 0:

    current_identity()            -> dict with user_id / role / region_id
    current_region_id()           -> int | None   (None == super admin, all regions)
    is_super_admin()              -> bool
    scope_to_region(query, Model) -> Query filtered to the caller's region
    role_required(*roles)         -> decorator, 403 on mismatch
    get_or_404(Model, pk)         -> instance in caller's region, else 404
"""
from functools import wraps

from flask_jwt_extended import get_jwt, get_jwt_identity, verify_jwt_in_request

from app.extensions import db
from app.utils.errors import Forbidden, NotFound

ROLE_SUPER_ADMIN = "super_admin"
ROLE_REGIONAL_ADMIN = "regional_admin"
ROLE_USER = "user"

ADMIN_ROLES = (ROLE_SUPER_ADMIN, ROLE_REGIONAL_ADMIN)


def current_identity():
    """Read the claims Dev A writes into the token at login."""
    claims = get_jwt()
    return {
        "user_id": get_jwt_identity(),
        "role": claims.get("role", ROLE_USER),
        "region_id": claims.get("region_id"),
    }


def current_role():
    return current_identity()["role"]


def current_region_id():
    """None for the super admin, whose region_id column is nullable."""
    return current_identity()["region_id"]


def is_super_admin():
    return current_role() == ROLE_SUPER_ADMIN


def scope_to_region(query, model):
    """
    The single scoping helper. Written once, applied to every read endpoint.

    Super admin sees everything. Everyone else is pinned to the region in
    their token - never a region_id read from the request.
    """
    if is_super_admin():
        return query

    region_id = current_region_id()
    if region_id is None:
        # A non-super-admin with no region is a broken account, not an
        # invitation to read the whole database.
        raise Forbidden("Your account is not assigned to a region")

    return query.filter(model.region_id == region_id)


def role_required(*roles):
    """Gate an endpoint to specific roles. Super admin always passes."""

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            role = current_role()
            if role != ROLE_SUPER_ADMIN and role not in roles:
                raise Forbidden("You do not have permission to perform this action")
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def get_or_404(model, pk):
    """
    Fetch a record and confirm it belongs to the caller's region.

    Returns 404 rather than 403 on a cross-region hit. A 403 would confirm the
    record exists, which lets someone enumerate another branch's IDs.
    """
    instance = db.session.get(model, pk)
    if instance is None:
        raise NotFound(f"{model.__name__} not found")

    if is_super_admin():
        return instance

    if instance.region_id != current_region_id():
        raise NotFound(f"{model.__name__} not found")

    return instance


def resolve_region_for_write(payload_region_id=None):
    """
    Region assigned on create comes from the token, never the body.

    The one exception: a super admin has no region of their own, so they must
    state which region they are acting for.
    """
    if is_super_admin():
        if payload_region_id is None:
            raise Forbidden(
                "Super administrator must specify a region_id when creating records"
            )
        return payload_region_id

    region_id = current_region_id()
    if region_id is None:
        raise Forbidden("Your account is not assigned to a region")
    return region_id

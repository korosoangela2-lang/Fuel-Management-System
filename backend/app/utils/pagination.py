"""List-response helper. Every collection endpoint returns the same envelope."""
from flask import request

DEFAULT_PER_PAGE = 20
MAX_PER_PAGE = 100


def paginate(query, schema):
    """
    Run a legacy-style SQLAlchemy Query through Flask-SQLAlchemy pagination
    and serialise it with the supplied (many=True) Marshmallow schema.
    """
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", DEFAULT_PER_PAGE, type=int)
    per_page = max(1, min(per_page, MAX_PER_PAGE))

    result = query.paginate(page=page, per_page=per_page, error_out=False)

    return {
        "items": schema.dump(result.items),
        "meta": {
            "page": result.page,
            "per_page": result.per_page,
            "total": result.total,
            "pages": result.pages,
            "has_next": result.has_next,
            "has_prev": result.has_prev,
        },
    }

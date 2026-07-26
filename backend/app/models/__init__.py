"""
Model registry.

Every model must be imported here. Alembic only sees what has been imported
by the time `flask db migrate` runs — miss one and it silently generates an
empty migration.

Dev A's models resolve if their branch is present, otherwise the placeholders
stand in so Dev B's slice runs on its own. Each import is guarded separately
so a partial merge does not break the whole registry.
"""
try:
    from app.models.region import Region  # noqa: F401
except ImportError:
    from app.models._placeholders import Region  # noqa: F401

try:
    from app.models.user import User  # noqa: F401
except ImportError:
    from app.models._placeholders import User  # noqa: F401

try:
    from app.models.fuel import Fuel  # noqa: F401
except ImportError:
    from app.models._placeholders import Fuel  # noqa: F401

from app.models.customer import Customer  # noqa: F401,E402
from app.models.distribution import Distribution  # noqa: F401,E402
from app.models.order import Order, OrderItem  # noqa: F401,E402

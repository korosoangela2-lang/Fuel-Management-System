"""
Model registry.

Every model must be imported here. Alembic only sees what has been imported
by the time `flask db migrate` runs — miss one and it silently generates an
empty migration.

Dev A (identity, access control, inventory) and Dev B (customers, orders,
distribution) are both merged in.
"""
from app.models.region import Region  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.fuel import Fuel  # noqa: F401
from app.models.refinery import Refinery  # noqa: F401
from app.models.token_blocklist import TokenBlocklist  # noqa: F401

from app.models.customer import Customer  # noqa: F401
from app.models.distribution import Distribution  # noqa: F401
from app.models.order import Order, OrderItem  # noqa: F401

import os
import sys

# Ensure the backend directory (and its parent) are on sys.path so
# `from app import ...` works regardless of how the script is executed.
# This covers running `python backend/run.py` from the repo root or
# running it from the backend directory.
_project_dir = os.path.abspath(os.path.dirname(__file__))
_parent_dir = os.path.abspath(os.path.join(_project_dir, ".."))
for p in (_project_dir, _parent_dir):
    if p not in sys.path:
        sys.path.insert(0, p)

from app import create_app
from app.extensions import db


# Accept either a full import path (app.config.ProductionConfig) or just
# the short name (ProductionConfig) for FLASK_CONFIG. Default to
# DevelopmentConfig for local development.
_flask_config = os.getenv("FLASK_CONFIG", "app.config.DevelopmentConfig")
if "." not in _flask_config:
    _flask_config = f"app.config.{_flask_config}"

app = create_app(_flask_config)


@app.shell_context_processor
def shell_context():
    from app.models import (
        Customer,
        Distribution,
        Fuel,
        Order,
        OrderItem,
        Refinery,
        Region,
        User,
    )

    return {
        "db": db,
        "User": User,
        "Region": Region,
        "Fuel": Fuel,
        "Refinery": Refinery,
        "Customer": Customer,
        "Order": Order,
        "OrderItem": OrderItem,
        "Distribution": Distribution,
    }


if __name__ == "__main__":
    # Use PORT if provided (Render sets this), default to 5000 for local dev.
    try:
        port = int(os.getenv("PORT", 5000))
    except (TypeError, ValueError):
        port = 5000

    # Respect the app configuration for DEBUG instead of forcing True here.
    debug = app.config.get("DEBUG", False)
    # Bind to 0.0.0.0 so services like Render or Docker can reach the server.
    app.run(host="0.0.0.0", port=port, debug=debug)

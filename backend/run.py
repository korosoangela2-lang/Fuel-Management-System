import os
import sys

# Ensure the backend directory is on sys.path so `from app import ...` works
# even when running `python backend/run.py` from the repository root.
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app
from app.extensions import db

# Locally this defaults to DevelopmentConfig. In production (Render), set
# FLASK_CONFIG=app.config.ProductionConfig so gunicorn picks up Postgres and
# turns debug mode off.
app = create_app(os.getenv("FLASK_CONFIG", "app.config.DevelopmentConfig"))


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
    port = int(os.getenv("PORT", 5000))
    # Respect the app configuration for DEBUG instead of forcing True here.
    debug = app.config.get("DEBUG", False)
    # Bind to 0.0.0.0 so services like Render or Docker can reach the server.
    app.run(host="0.0.0.0", port=port, debug=debug)

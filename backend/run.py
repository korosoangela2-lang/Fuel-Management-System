import os

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
    app.run(debug=True, port=5000)

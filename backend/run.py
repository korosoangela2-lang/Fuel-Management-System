from app import create_app
from app.extensions import db

app = create_app()


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

"""
Application factory — Dev B slice.

Only Dev B's blueprints are registered here. Dev A's imports and
registrations are commented out; uncomment them as their branch merges.
"""
from flask import Flask, jsonify

from app.extensions import cors, db, jwt, ma, migrate
from app.utils.errors import register_error_handlers


def create_app(config_object="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    register_error_handlers(app)

    # Models must be imported before migrations run.
    from app import models  # noqa: F401

    from app.routes.customer_routes import customer_bp
    from app.routes.distribution_routes import distribution_bp
    from app.routes.order_routes import order_bp
    from app.routes.report_routes import report_bp

    for bp in (customer_bp, order_bp, distribution_bp, report_bp):
        app.register_blueprint(bp)

    # Dev A's blueprints:
    # from app.routes.auth_routes import auth_bp
    # from app.routes.region_routes import region_bp
    # from app.routes.fuel_routes import fuel_bp
    # from app.routes.refinery_routes import refinery_bp
    # from app.routes.user_routes import user_bp

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "slice": "dev-b"}), 200

    return app

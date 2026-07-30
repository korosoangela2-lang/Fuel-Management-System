"""
Application factory — merged Dev A + Dev B slices.

Registers both developers' blueprints: Dev A owns identity, access control
and inventory; Dev B owns customers, orders, distribution and reporting.
"""
from flask import Flask, jsonify

from app.extensions import cors, db, jwt, ma, migrate
from app.utils.errors import register_error_handlers
from app.utils.jwt_callbacks import register_jwt_callbacks


def create_app(config_object="app.config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    register_error_handlers(app)
    register_jwt_callbacks(app)

    # Models must be imported before migrations run.
    from app import models  # noqa: F401

    from app.routes.auth_routes import auth_bp
    from app.routes.customer_routes import customer_bp
    from app.routes.distribution_routes import distribution_bp
    from app.routes.fuel_routes import fuel_bp
    from app.routes.order_routes import order_bp
    from app.routes.profile_routes import profile_bp
    from app.routes.refinery_routes import refinery_bp
    from app.routes.region_routes import region_bp
    from app.routes.report_routes import report_bp
    from app.routes.user_routes import user_bp

    for bp in (
        auth_bp, region_bp, user_bp, fuel_bp, refinery_bp, profile_bp,
        customer_bp, order_bp, distribution_bp, report_bp,
    ):
        app.register_blueprint(bp)

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "slice": "merged"}), 200

    return app

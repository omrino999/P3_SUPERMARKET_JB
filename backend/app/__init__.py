from flask import Flask
from config import Config
from app.extensions import db, cors, jwt

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    # CORS: Allow requests from frontend (localhost:5173 and 127.0.0.1:5173)
    cors.init_app(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})
    jwt.init_app(app)

    # Import models
    from app import models

    # Register blueprints
    from app.routes.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.routes.auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    from app.routes.admin import bp as admin_bp
    app.register_blueprint(admin_bp)

    from app.routes.cart import bp as cart_bp
    app.register_blueprint(cart_bp)

    from app.routes.orders import bp as orders_bp
    app.register_blueprint(orders_bp)

    return app

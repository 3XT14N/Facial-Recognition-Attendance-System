# app/__init__.py
from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from config import Config
from gridfs import GridFS  # Correct import for GridFS

mongo = PyMongo()
fs = None

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    mongo.init_app(app)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    # Initialize GridFS
    global fs
    db = mongo.cx.get_database()
    fs = GridFS(db)  # Use GridFS directly

    # Register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.photo_routes import photo_bp
    from app.routes.user_routes import user_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(photo_bp)
    app.register_blueprint(user_bp)

    return app
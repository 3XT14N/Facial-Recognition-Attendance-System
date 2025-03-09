from flask import Blueprint, jsonify
from .auth_routes import auth_bp

# Define a Blueprint for the default route
home_bp = Blueprint("home", __name__)

@home_bp.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Facial Recognition Attendance System API is running"}), 200

def register_blueprints(app):
    """Register all route blueprints"""
    app.register_blueprint(home_bp)  # Default route
    app.register_blueprint(auth_bp, url_prefix="/api/register")  # Authentication routes

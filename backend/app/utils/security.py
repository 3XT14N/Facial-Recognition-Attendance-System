# app/utils/security.py
from werkzeug.security import generate_password_hash
import jwt
from datetime import datetime, timedelta
from config import Config
from functools import wraps
from flask import request, jsonify
from config import Config
from app.models.user_model import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")  # Expect "Bearer <token>"
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        
        try:
            token = token.split(" ")[1]  # Extract token from "Bearer <token>"
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            current_user = User.find_by_id(data["user_id"])  # Fetch user from DB
            if not current_user:
                return jsonify({"error": "User not found"}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(current_user, *args, **kwargs)  # Pass user data to the route

    return decorated

def validate_registration_data(data):
    """
    Validate the registration data to ensure all required fields are present.

    Args:
        data (dict): The registration data containing name, email, password, photo, and role.

    Returns:
        str: An error message if a required field is missing, otherwise None.
    """
    required_fields = ["name", "email", "password", "photo", "role"]
    for field in required_fields:
        if not data.get(field):
            return f"{field.capitalize()} is required"
    return None

def hash_password(password):
    """
    Hash a password using Werkzeug's generate_password_hash.

    Args:
        password (str): The plaintext password to hash.

    Returns:
        str: The hashed password.
    """
    return generate_password_hash(password)

def generate_token(user_id):
    """
    Generate a JSON Web Token (JWT) for the given user ID.

    Args:
        user_id (str): The ID of the user.

    Returns:
        str: The encoded JWT.
    """
    payload = {
        "user_id": str(user_id),
        "exp": datetime.utcnow() + timedelta(hours=1),  # Token expires in 1 hour
    }
    return jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")
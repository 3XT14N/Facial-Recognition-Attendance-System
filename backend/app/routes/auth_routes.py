from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from app.services.user_service import register_user
from app.utils.security import validate_registration_data, generate_token, token_required
from app.models.user_model import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/register", methods=["POST"])
def register():
    """
    Handles user registration.
    """
    data = request.json

    # Validate input data
    validation_error = validate_registration_data(data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    # Register user
    result = register_user(data)
    if "error" in result:
        return jsonify({"error": result["error"]}), 400

    return jsonify(result), 201  # 201 Created status for successful registration


@auth_bp.route("/api/login", methods=["POST"])
def login():
    """
    Handles user login.
    """
    data = request.json
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    # Validate required fields
    if not email or not password or not role:
        return jsonify({"error": "Email, password, and role are required"}), 400

    # Find user by email and role
    user = User.find_by_email_and_role(email, role)
    if not user:
        return jsonify({"error": "Invalid email or role"}), 404

    # Verify password
    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid password"}), 401

    # Generate token
    token = generate_token(user["_id"])

    # Construct response with role-specific ID
    response = {
        "message": "Login successful",
        "token": token,
        "id": str(user["_id"]),
        "name": user["name"],
        "role": user["role"],
        "student_id": user.get("student_id") if role == "student" else None,
        "prof_id": user.get("prof_id") if role == "professor" else None,
    }

    return jsonify(response), 200


@auth_bp.route("/api/users/me", methods=["GET"])
@token_required  # This ensures only authenticated users can access
def get_logged_in_user(current_user):
    """
    Fetch the logged-in user's profile using their token.
    """
    user = User.find_by_id(current_user["_id"])
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "student_id": user.get("student_id"),
        "prof_id": user.get("prof_id"),
    }

    return jsonify(user_data), 200

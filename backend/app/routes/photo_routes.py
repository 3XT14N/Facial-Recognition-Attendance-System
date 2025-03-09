# app/routes/photo_routes.py
from flask import Blueprint, jsonify
from bson import ObjectId
from app.services.photo_service import get_photo

photo_bp = Blueprint('photo', __name__)

@photo_bp.route("/api/photo/<photo_id>", methods=["GET"])
def get_photo_route(photo_id):
    try:
        photo = get_photo(photo_id)
        return photo.read(), 200, {"Content-Type": "image/jpeg"}
    except Exception:
        return jsonify({"error": "Image not found"}), 404
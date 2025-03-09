from flask import Blueprint, request, jsonify, send_file
import gridfs
import io
from pymongo import MongoClient
from config import Config
from bson import ObjectId  # Needed to query by ObjectId

# Initialize MongoDB and GridFS
client = MongoClient(Config.MONGO_URI)
db = client.get_database()  # Automatically selects database from URI
fs = gridfs.GridFS(db)

user_bp = Blueprint('user', __name__)

@user_bp.route("/api/user/photo/<user_id>", methods=["GET"])
def get_user_photo(user_id):
    try:
        print(f"Fetching user photo for user_id: {user_id}")  # Debugging

        # Get user's photo_id from the users collection
        user = db.users.find_one({"_id": ObjectId(user_id)}, {"photo_id": 1})
        if not user or "photo_id" not in user:
            print("User not found or no photo_id")  # Debugging
            return jsonify({"error": "User or photo not found"}), 404

        photo_id = user["photo_id"]
        print(f"Found photo_id: {photo_id}")  # Debugging

        # Find the photo using photo_id
        file = fs.find_one({"_id": ObjectId(photo_id)})
        if not file:
            print("Photo not found in GridFS.")  # Debugging
            return jsonify({"error": "Photo not found"}), 404

        print(f"Serving image: {file.filename}")  # Debugging

        # Determine MIME type from filename
        content_type = "image/jpeg"  # Default
        if file.filename.endswith(".png"):
            content_type = "image/png"

        # Return image as a response
        return send_file(io.BytesIO(file.read()), mimetype=content_type)

    except Exception as e:
        print(f"Error: {e}")  # Debugging
        return jsonify({"error": str(e)}), 500


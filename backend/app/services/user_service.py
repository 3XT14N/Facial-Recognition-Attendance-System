# app/services/user_service.py
import base64
import io
from app.models.user_model import User
from app.utils.gridfs_utils import get_file_from_gridfs
from app.utils.security import hash_password
from app import fs

def register_user(data):
    """
    Registers a new user, storing their profile picture in GridFS and saving user details in the database.

    Args:
        data (dict): A dictionary containing user details.

    Returns:
        dict: A success message with user ID or an error message.
    """
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    photo_base64 = data.get("photo")
    role = data.get("role", "student")  # Default to "student" if not specified
    student_id = data.get("studentId") if role == "student" else None
    prof_id = data.get("profId") if role == "professor" else None

    # Hash password
    hashed_password = hash_password(password)

    # Decode Base64 image and store in GridFS
    try:
        image_data = base64.b64decode(photo_base64.split(",")[1])
        image_id = fs.put(io.BytesIO(image_data), filename=f"{email}_profile.jpg")
    except Exception as e:
        return {"error": "Invalid image data"}

    # Store user data
    user_id = User.create_user(name, email, hashed_password, str(image_id), role, student_id, prof_id)

    return {"message": "User registered successfully", "user_id": str(user_id)}

class UserService:
    @staticmethod
    def get_user_profile(user_id):
        """
        Retrieves user profile data, including name, email, role, and profile picture.

        Args:
            user_id (str): The user ID.

        Returns:
            dict or None: A dictionary containing user profile data, or None if not found.
        """
        user = User.find_by_id(user_id)
        if not user:
            return None

        profile = {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "photo": get_file_from_gridfs(user["photo_id"]) if "photo_id" in user else None,
            "student_id": user.get("student_id"),
            "prof_id": user.get("prof_id")
        }
        return profile

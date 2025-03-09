# app/models/user_model.py
from app import mongo
from bson import ObjectId

class User:
    @staticmethod
    def create_user(name, email, hashed_password, photo_id, role, student_id=None, prof_id=None):
        """
        Create a new user in the database.
        
        Args:
            name (str): The user's name.
            email (str): The user's email.
            hashed_password (str): The hashed password.
            photo_id (str): The ID of the user's profile photo in GridFS.
            role (str): The user's role (e.g., "student" or "professor").
            student_id (str, optional): The student's ID (if applicable).
            prof_id (str, optional): The professor's ID (if applicable).
        
        Returns:
            ObjectId: The ID of the newly created user.
        """
        user_data = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "photo_id": photo_id,
            "role": role,
            "student_id": student_id if role == "student" else None,
            "prof_id": prof_id if role == "professor" else None,
        }
        return mongo.db.users.insert_one(user_data).inserted_id

    @staticmethod
    def find_by_email_and_role(email, role):
        """
        Find a user by their email and role.
        
        Args:
            email (str): The user's email.
            role (str): The user's role (e.g., "student" or "professor").
        
        Returns:
            dict: The user document if found, otherwise None.
        """
        return mongo.db.users.find_one({"email": email, "role": role})

    @staticmethod
    def find_by_id(user_id):
        """
        Find a user by their ID.
        
        Args:
            user_id (str): The user's ID.
        
        Returns:
            dict: The user document if found, otherwise None.
        """
        return mongo.db.users.find_one({"_id": ObjectId(user_id)})

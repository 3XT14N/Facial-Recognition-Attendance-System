    # app/services/photo_service.py
from bson import ObjectId
from app import fs

def get_photo(photo_id):
    return fs.get(ObjectId(photo_id))
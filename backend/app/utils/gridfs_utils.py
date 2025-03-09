from app import mongo
import gridfs

fs = gridfs.GridFS(mongo.db)

def get_file_from_gridfs(file_id):
    try:
        file = fs.get(file_id)
        return file.read()
    except:
        return None
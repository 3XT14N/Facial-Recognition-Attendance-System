import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';

dotenv.config();

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => ({
    bucketName: 'uploads',
    filename: `${Date.now()}-${file.originalname}`,
  }),
});

const upload = multer({ storage }).single('photo'); // 'photo' is the key expected from the frontend

export default upload;

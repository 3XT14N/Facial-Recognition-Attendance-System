import express from 'express';
import { registerUser, loginUser, getProfilePhoto } from '../controllers/authController.js';  // Ensure correct file extensions
import upload from "../middleware/upload.js";  // Ensure correct file extension

const router = express.Router();

// POST /api/auth/signup - Register a new user
router.post("/signup", upload, registerUser); // Use upload as a middleware
console.log(upload); // Log the upload middleware function to ensure it's being properly imported

// GET /api/auth/photo/:id - Get the profile photo by file ID (from GridFS)
router.get("/photo/:id", getProfilePhoto);

// POST /api/auth/signin - User login
router.post('/signin', loginUser);

// Export the router for use in the app
export default router;  // Using default export

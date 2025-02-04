import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';  // Ensure the file extension is included
import authRoutes from './routes/authRoutes.js'; // Ensure the file extension is included
import cors from 'cors';  // Import CORS for handling CORS issues

dotenv.config();

// Database connection
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON payloads
app.use(cors()); // Handle CORS issues

// Routes
app.use('/api/auth', authRoutes); // Use the auth routes for /api/auth

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

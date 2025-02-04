import User from '../models/User.js';  // Ensure the correct file extension
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Grid from 'gridfs-stream';
import dotenv from 'dotenv';

dotenv.config();

// Create a new connection to MongoDB (since mongoose.createConnection is used)
const conn = mongoose.createConnection(process.env.MONGODB_URI);

// Initialize GridFS once the connection is established
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads'); // Specify the GridFS collection
});

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Login Controller
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Find user by email and role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or role." });
    }

    // Compare passwords
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate token and send response
    const token = generateToken(user._id);
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, role, studentId, strand, professorId } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Profile photo is required." });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      studentId: role === "student" ? studentId : null,
      strand: role === "student" ? strand : null,
      professorId: role === "professor" ? professorId : null,
      photo: req.file.id, // Store GridFS file ID
    });
    console.log(req.file); // Check the structure of req.file
    await user.save(); // Save the user
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get Profile Photo
const getProfilePhoto = async (req, res) => {
  try {
    // Fetch file from GridFS using file ID
    gfs.files.findOne({ _id: req.params.id }, (err, file) => {
      if (err || !file) {
        return res.status(404).json({ message: "No image found" });
      }

      // If file exists, create a read stream and pipe it to the response
      const readStream = gfs.createReadStream(file._id);
      readStream.pipe(res);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export { registerUser, loginUser, getProfilePhoto };  // Using named exports

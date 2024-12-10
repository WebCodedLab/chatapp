import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import { registerUser as registerUserService } from "../services/user.service.js";
import bcrypt from "bcrypt";
import cloudinary from "../services/cloudinary.service.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, profilePicture } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await registerUserService({
      fullname,
      email,
      password: hashedPassword,
      profilePicture,
    });

    const token = await user.generateToken();

    res.cookie("token", token);
    return res
      .status(201)
      .json({ user, token, message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    user.isOnline = true;
    await user.save();

    const token = await user.generateToken();
    res.cookie("token", token);

    return res
      .status(200)
      .json({ 
        user, 
        token, 
        message: "User logged in successfully"
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await User.findByIdAndUpdate(decoded.id, { isOnline: false });
    await User.findByIdAndUpdate(decoded.id, { lastSeen: new Date() });
    
    // Clear the cookie
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  res.status(200).json(user);
}

export const uploadProfilePicture = async (req, res) => {
  try {
    const { file } = req.body;

    
    
    if (!file || !file.includes('base64')) {
      return res.status(400).json({ message: "Invalid file format" });
    }

    const user = await User.findById(req.user._id);
    if (user.profilePicture) {
      const publicId = user.profilePicture.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
    }

    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: "profile_pictures"
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePicture: result.secure_url
      },
      { new: true }
    );

    return res.status(200).json({ 
      user: updatedUser,
      message: "Profile picture updated successfully"
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Failed to upload image" });
  }
};

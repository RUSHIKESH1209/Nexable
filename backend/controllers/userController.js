import userModel from "../models/userModel.js";
import validator from "validator";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import notificationModel from "../models/notificationModel.js";
import { OAuth2Client } from 'google-auth-library';


// Create JWT Token with Expiry
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Upload image from buffer to Cloudinary
async function uploadSingleFile(file) {
  if (!file) return null;

  const bufferStream = new Readable();
  bufferStream.push(file.buffer);
  bufferStream.push(null);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    bufferStream.pipe(uploadStream);
  });
}

// Register User controller
const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    name = name?.trim();
    email = email?.trim();
    password = password?.trim();

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    const exists = await userModel.findOne({ email: { $regex: new RegExp("^" + email + "$", "i") } });
    if (exists) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ name, email, password: hashedPassword });

    const token = createToken(newUser._id);
    return res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Login User controller
const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Create / Update Profile controller
const CreateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let { about, phone, address, skills, position, company } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const profilePicFile = req.files?.profilePic?.[0] || null;
    const imageUrl = await uploadSingleFile(profilePicFile);

    if (imageUrl) user.profilePic = imageUrl;
    if (about) user.about = about;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (skills) user.skills = JSON.parse(skills);
    if (position) user.position = position;
    if (company) user.company = company;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Create Profile Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Show my profile controller
const showProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Show Profile Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// show profile by users id 
const showUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Show User Profile Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//  connections and notification creation wwhen connected or disconnected
const updateConnections = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { connectionId } = req.body;

    if (!userId || !connectionId) {
      return res.status(400).json({ success: false, message: "User ID and Connection ID are required" });
    }


    if (!mongoose.Types.ObjectId.isValid(connectionId)) {
      return res.status(400).json({ success: false, message: "Invalid connection ID" });
    }

    const user = await userModel.findById(userId);


    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isConnected = user.connections.includes(connectionId);

    if (!isConnected) {
      user.connections.push(connectionId);
      await user.save();

      if (connectionId !== userId) {
        try {
          notificationModel.create({
            recipient: connectionId,
            sender: userId,
            type: 'connection',
          });

        } catch (err) {
          console.error('Notification creation error:', err.message);
        }

      }

      return res.status(200).json({ success: true, message: "Connection added successfully", user });

    } else {
      user.connections = user.connections.filter(id => id.toString() !== connectionId);
      await user.save();

      await notificationModel.findOneAndDelete({
        recipient: connectionId,
        sender: userId,
        type: 'connection',
      }).catch(err => console.error('Notification deletion error:', err.message));


      return res.status(200).json({ success: true, message: "Connection removed successfully", user });
    }


  } catch (error) {
    console.error("Update Connections Error:", error.message, error.stack);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// search user controller

const searchUser = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    const users = await userModel.find(
      {
        $or: [ 
          { name: { $regex: query, $options: 'i' } }, 
          { company: { $regex: query, $options: 'i' } } 
        ]
      },
      'name profilePic _id connections' 
    );
    res.json({ users });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// google sign-in controller

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleAuthController = async (req, res) => {
  try {
    const { credential } = req.body;

    console.log('Google Auth Credential:', credential);

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await userModel.findOne({ email });
    let isNewUser = false;

    if (!user) {
      // Register new user
      user = await userModel.create({
        email,
        name,
        profilePic: picture,
        password: '', // Optional
      });
      console.log('New user registered via Google:', email);
      isNewUser = true;
    } else {
      console.log('User logged in via Google:', email);
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ token, isNewUser });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

export {
  loginUser,
  registerUser,
  CreateProfile,
  showProfile,
  showUserProfile,
  updateConnections,
  searchUser,
  googleAuthController
};

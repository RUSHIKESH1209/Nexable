import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// Create JWT Token with Expiry
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Upload image to Cloudinary
async function uploadSingleFile(file) {
  if (!file) return null;
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "image",
  });
  return result.secure_url;
}

// Register User
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

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.",
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

// Login User
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

// Create / Update Profile using Token
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

    const profilePicFile = req.files?.profilePic ? req.files.profilePic[0] : null;
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

const showProfile = async (req, res) => {
  try {
    const userId = req.user?.id; // get userId from auth middleware

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find user by ID, exclude password field for security
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


export { loginUser, registerUser, CreateProfile , showProfile};

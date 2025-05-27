import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Create JWT Token with Expiry
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

async function uploadSingleFile(file) {
    if (!file) return null;

    const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
    return result.secure_url;
}


//User Registration
const registerUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        // Trim inputs
        name = name?.trim();
        email = email?.trim();
        password = password?.trim();

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Enter a valid email" });
        }

        // Check if user exists (case-insensitive)
        const exists = await userModel.findOne({ email: { $regex: new RegExp("^" + email + "$", "i") } }).lean();
        if (exists) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        // Validate strong password
        if (!validator.isStrongPassword(password, { minLength: 8, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters, include an uppercase letter, a number, and a special character."
            });
        }


        // Hash password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await userModel.create({ name, email, password: hashedPassword });

        // Generate JWT Token
        const token = createToken(newUser._id);

        return res.status(201).json({ success: true, token });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


//  User Login
const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        // Trim inputs
        email = email?.trim();
        password = password?.trim();

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Enter a valid email" });
        }

        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = createToken(user._id);

        return res.status(200).json({ success: true, token });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const CreateProfile = async (req, res) => {
    try {
        let { email, profilePic, about, phone, address, skills, position, company } = req.body;

        // Find the user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const profilePicFile = req.files?.profilePic ? req.files.profilePic[0] : null;

        const imageUrl = await uploadSingleFile(profilePicFile);

        // Update user profile fields
        user.profilePic = imageUrl;
        user.about = about || user.about;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.skills = skills || user.skills;
        user.position = position || user.position;
        user.company = company || user.company;


        // Save the updated user document
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



//  Export all functions
export { loginUser, registerUser, CreateProfile };

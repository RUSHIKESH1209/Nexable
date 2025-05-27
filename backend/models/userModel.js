import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    profilePic: { type: String }, // URL or path to image
    about: { type: String },
    phone: { type: String },
    address: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: [{ type: String }], // Array of skills
    position: { type: String },
    company: { type: String },
}, { timestamps: true });


const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel 
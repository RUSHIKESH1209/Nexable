import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    profilePic: { type: String, default:  "https://res.cloudinary.com/dokaepuia/image/upload/v1749764954/wud8kg61kwbmymgbmetj.png" },
    about: { type: String },
    phone: { type: String },
    address: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    skills: [{ type: String }], 
    position: { type: String },
    company: { type: String },
    connections: [{ type: String }],
    
}, { timestamps: true });

userSchema.index({ name: 'text' }); 


const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel 
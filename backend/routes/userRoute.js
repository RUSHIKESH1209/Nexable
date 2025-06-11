import express from "express";
const userRouter = express.Router();
import upload from "../middleware/multer.js";

import { loginUser, registerUser, CreateProfile ,showProfile, showUserProfile, updateConnections } from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import userModel from "../models/userModel.js";
import { getAllUsers, suggestUsers } from "../controllers/suggestions.js";

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post(
  "/createprofile",
  authUser,  // Protect this route with auth middleware
  upload.fields([{ name: "profilePic", maxCount: 1 }]),
  CreateProfile
);

userRouter.get("/profile", authUser, showProfile);
userRouter.get("/profile/:id", authUser, showUserProfile); // Show user profile by ID


userRouter.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    const users = await userModel.find({
      name: { $regex: query, $options: 'i' }, // Case-insensitive regex search
    }).select('name profilePic email');

    res.json({ users });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



userRouter.get('/all', authUser, getAllUsers);
userRouter.get('/suggestions' ,authUser ,suggestUsers)
userRouter.post('/updateConnections', authUser ,updateConnections)




export default userRouter;

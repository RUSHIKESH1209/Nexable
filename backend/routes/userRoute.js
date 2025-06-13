import express from "express";
const userRouter = express.Router();
import upload from "../middleware/multer.js";

import { loginUser, registerUser, CreateProfile ,showProfile, showUserProfile, updateConnections, searchUser, googleAuthController } from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import userModel from "../models/userModel.js";
import { getAllUsers, suggestUsers } from "../controllers/suggestions.js";

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authUser, showProfile);
userRouter.get("/profile/:id", authUser, showUserProfile); 
userRouter.get('/search', searchUser);
userRouter.get('/all', authUser, getAllUsers);
userRouter.get('/suggestions' ,authUser ,suggestUsers)
userRouter.post('/updateConnections', authUser ,updateConnections)
userRouter.post('/google-login', googleAuthController);
userRouter.use(
  "/createprofile",
  authUser,  
  upload.fields([{ name: "profilePic", maxCount: 1 }]),
  CreateProfile
);




export default userRouter;

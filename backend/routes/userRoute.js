import express from "express";
const userRouter = express.Router();
import upload from "../middleware/multer.js";

import { loginUser, registerUser, CreateProfile } from "../controllers/userController.js"


userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/createprofile",
    upload.fields([{ name: 'profilePic', maxCount: 1 }]),
    CreateProfile
);
export default userRouter
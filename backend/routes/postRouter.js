import express from "express";
import authUser from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import  { addComment, createPost, getComments, postLikes, posts } from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/create", authUser, upload.fields([{ name: "postPic", maxCount: 1 }]), createPost);
postRouter.get("/posts", authUser, posts)
postRouter.post("/postlikes/:postId", authUser, postLikes);
postRouter.post("/comment/:postId", authUser, addComment);
postRouter.get("/getcomments/:postId", authUser, getComments);

export default postRouter;
 
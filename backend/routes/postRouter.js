import express from "express";
import authUser from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import  { addComment, createPost, getComments, getSinglePost, postLikes, posts } from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/create", authUser, upload.single("postPic"), createPost);
postRouter.get("/posts", authUser, posts);
postRouter.get("/post/:postId", authUser, getSinglePost);
postRouter.post("/postlikes/:postId", authUser, postLikes);
postRouter.post("/comment/:postId", authUser, addComment);
postRouter.get("/getcomments/:postId", authUser, getComments);

export default postRouter;
 
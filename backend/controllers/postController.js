import postModel from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";
import notificationModel from '../models/notificationModel.js';



// cloudinary upload function
const uploadToCloudinary = async (file) => {
  if (!file || !file.buffer) throw new Error("Invalid file or missing buffer");

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });
};


// post creation controller 
const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const postPicFile = req.file || null;
    console.log("File received:", postPicFile);
    console.log("Buffer exists:", postPicFile?.buffer?.length > 0);

    const imageUrl = postPicFile ? await uploadToCloudinary(postPicFile) : null;

    const newPost = await postModel.create({
      userId,
      caption,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Create Post Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// gives all the posts in db 
const posts = async (req, res) => {
  try {

    const allPosts = await postModel.find({}).sort({ createdAt: -1 });
    if (!allPosts || allPosts.length === 0) {
      return res.status(404).json({ success: false, message: "No posts found" });
    }
    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts: allPosts,
    });



  } catch (error) {
    console.error("Fetch Posts Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }

}


// gives single post with its id 
 const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Post ID is required" });
    }

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// manages post liking and unliking functionality also notificaton creation
const postLikes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.params;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);

      await notificationModel.findOneAndDelete({
        recipient: post.userId,
        sender: userId,
        type: 'like',
        postId,
      })
    }

    else {
      post.likes.push(userId);

      if (post.userId.toString() !== userId) {
        await notificationModel.create({
          recipient: post.userId,
          sender: userId,
          type: 'like',
          postId,
        });
      }
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: hasLiked ? 'Post unliked' : 'Post liked',
      likesCount: post.likes.length,
      liked: !hasLiked,
    });

  } catch (error) {
    console.error('Like/Unlike Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



// manages post comments  functionality also notificaton creation
const addComment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const comment = {
      userId,
      text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    if (post.userId.toString() !== userId) {
      await notificationModel.create({
        recipient: post.userId,
        sender: userId,
        type: 'comment',
        postId,
        text,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });

  } catch (error) {
    console.error("Add Comment Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// serves allt the comments 
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({
      success: true,
      comments: post.comments || [],
    });
  } catch (error) {
    console.error("Get Comments Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export { createPost, posts, postLikes, addComment, getComments ,getSinglePost };

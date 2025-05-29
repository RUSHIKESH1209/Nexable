import postModel from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";

// Upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  if (!file) return null;
  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "image",
  });
  return result.secure_url;
};

const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const postPicFile = req.files?.postPic ? req.files.postPic[0] : null;
    const imageUrl = await uploadToCloudinary(postPicFile);

    const newPost = await postModel.create({
      userId,
      caption,
      image: imageUrl || null,
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


const posts = async (req, res) => {
    try {
        
        const allPosts = await postModel.find({  }).sort({ createdAt: -1 });
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


const postLikes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.params;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if user has already liked the post
    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      // Unlike the post
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like the post
      post.likes.push(userId);
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



export { createPost ,posts , postLikes ,addComment ,getComments};

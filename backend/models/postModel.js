// models/postModel.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    caption: {
      type: String,
    },
    image: {
      type: String, // URL from Cloudinary if uploaded
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);


const postModel = mongoose.models.post || mongoose.model("post", postSchema)

export default postModel 
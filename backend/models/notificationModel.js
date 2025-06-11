import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['like', 'comment', 'connection-request', 'connection-accepted', 'message'], // ← add "message"
      required: true,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    text: { type: String }, // optional for comment content
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const notificationModel =
  mongoose.models.notification || mongoose.model('notification', notificationSchema);

export default notificationModel;

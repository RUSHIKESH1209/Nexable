const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postCaption: { type: String },
    postPic: { type: String }, // Optional image
    likes: { type: Number, default: '0' },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String }
    }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);

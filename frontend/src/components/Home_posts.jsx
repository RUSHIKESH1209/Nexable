// Home_posts.js
import React, { useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';

const Home_posts = () => {
  const [posts, setPosts] = useState([]);
  const [commentBoxes, setCommentBoxes] = useState({});
  const [newComments, setNewComments] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    const dummyPosts = [
      {
        id: 1,
        caption: 'Enjoying the sunset!',
        image: '/profilepic.png',
        likes: 12,
        comments: ['Beautiful view!', 'Awesome!', 'Love it!'],
      },
      {
        id: 2,
        caption: 'Code. Eat. Sleep. Repeat.',
        image: '/login.png',
        likes: 25,
        comments: ['So true!', 'Daily routine.', 'Respect.'],
      },
      {
        id: 3,
        caption: 'Just deployed my MERN stack project!',
        image: '',
        likes: 40,
        comments: ['Congrats!', 'Share the repo?', 'Amazing!'],
      },
    ];

    setPosts(dummyPosts);
  }, []);

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: likedPosts.has(postId) ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );

    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleComments = (postId) => {
    setCommentBoxes((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId) => {
    const comment = newComments[postId];
    if (!comment) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );

    setNewComments((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-gray-100 min-h-screen">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md transition hover:shadow-lg"
        >
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="max-h-[70vh] w-full object-contain rounded-xl mb-4"
            />
          )}
          <p className="text-gray-800 text-base font-medium mb-4">{post.caption}</p>

          <div className="flex items-center gap-6 text-gray-600 text-lg mb-3">
            <button
              onClick={() => handleLike(post.id)}
              className="flex items-center gap-2 hover:text-red-500 transition"
            >
              {likedPosts.has(post.id) ? (
                <AiFillHeart size={24} className="text-red-500" />
              ) : (
                <AiOutlineHeart size={24} className="text-gray-400" />
              )}
              <span className="text-sm">{post.likes} Likes</span>
            </button>
            <button
              onClick={() => toggleComments(post.id)}
              className="flex items-center gap-2 hover:text-blue-500 transition"
            >
              <BiCommentDetail size={24} className="text-gray-400" />
              <span className="text-sm">{post.comments.length} Comments</span>
            </button>
          </div>

          {commentBoxes[post.id] && (
            <div className="mt-4 space-y-2">
              {post.comments.map((cmt, idx) => (
                <div
                  key={idx}
                  className="text-sm text-gray-700 pl-4 border-l-4 border-green-300 bg-green-50 rounded p-2"
                >
                  {cmt}
                </div>
              ))}
              <div className="flex gap-3 items-center mt-2">
                <input
                  type="text"
                  value={newComments[post.id] || ''}
                  onChange={(e) =>
                    setNewComments({ ...newComments, [post.id]: e.target.value })
                  }
                  placeholder="Write a comment..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home_posts;

// Home_posts.js
import React, { useEffect, useState } from 'react';
import { FaRegCommentDots, FaHeart } from 'react-icons/fa';

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
        comments: ['Beautiful view!', 'Awesome!', 'Love it!']
      },
      {
        id: 2,
        caption: 'Code. Eat. Sleep. Repeat.',
        image: '/login.png',
        likes: 25,
        comments: ['So true!', 'Daily routine.', 'Respect.']
      },
      {
        id: 3,
        caption: 'Just deployed my MERN stack project!',
        image: '',
        likes: 40,
        comments: ['Congrats!', 'Share the repo?', 'Amazing!']
      }
    ];

    setPosts(dummyPosts);
  }, []);

  const handleLike = (postId) => {
    if (likedPosts.has(postId)) return;
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
    setLikedPosts((prev) => new Set(prev).add(postId));
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
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white border border-[#1F7D53] rounded-xl p-4 shadow"
        >
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="max-h-[70vh] h-auto w-auto object-contain rounded-md mb-3 mx-auto"
            />
          )}
          <p className="text-black text-sm mb-2">{post.caption}</p>
          <div className="text-sm text-[#EC5228] flex gap-6 items-center mb-2">
            <button
              onClick={() => handleLike(post.id)}
              className="flex items-center gap-1"
            >
              <FaHeart className={`transition ${likedPosts.has(post.id) ? 'text-[#EC5228]' : 'text-gray-400'}`} /> {post.likes} Likes
            </button>
            <button
              onClick={() => toggleComments(post.id)}
              className="flex items-center gap-1"
            >
              <FaRegCommentDots /> {post.comments.length} Comments
            </button>
          </div>

          {commentBoxes[post.id] && (
            <div className="mt-2 flex flex-col gap-2">
              {post.comments.map((cmt, idx) => (
                <div key={idx} className="text-sm text-gray-800 pl-2 border-l border-[#255F38]">
                  {cmt}
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComments[post.id] || ''}
                  onChange={(e) =>
                    setNewComments({ ...newComments, [post.id]: e.target.value })
                  }
                  placeholder="Write a comment..."
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm flex-1"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="bg-[#255F38] text-white px-3 py-1 text-sm rounded-md"
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

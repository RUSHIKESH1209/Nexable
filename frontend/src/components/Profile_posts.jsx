import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';

const Profile_posts = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const [posts, setPosts] = useState([]);
  const [userInfoMap, setUserInfoMap] = useState({});
  const [commentBoxes, setCommentBoxes] = useState({});
  const [newComments, setNewComments] = useState({});
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [visibleComments, setVisibleComments] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendURL}/api/post/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const postsData = response.data.posts;
        setPosts(postsData);

        // Set liked posts
        const currentUserId = JSON.parse(atob(token.split('.')[1])).id;
        const likedSet = new Set();
        postsData.forEach((post) => {
          if (post.likes.includes(currentUserId)) {
            likedSet.add(post._id);
          }
        });
        setLikedPosts(likedSet);

        // Fetch all user info (post owners + comment authors)
        const userIds = new Set();
        postsData.forEach((post) => {
          userIds.add(post.userId);
          post.comments.forEach((cmt) => userIds.add(cmt.userId));
        });

        const userMap = {};
        await Promise.all(
          [...userIds].map(async (id) => {
            try {
              const userRes = await axios.get(`${backendURL}/api/user/profile?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              userMap[id] = userRes.data.user;
            } catch (err) {
              console.error(`Error fetching user ${id}:`, err);
            }
          })
        );

        setUserInfoMap(userMap);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${backendURL}/api/post/postlikes/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { likesCount, liked } = response.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: Array(likesCount).fill('like') }
            : post
        )
      );

      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (liked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const toggleComments = (postId) => {
    setCommentBoxes((prev) => ({ ...prev, [postId]: !prev[postId] }));
    setVisibleComments((prev) => ({ ...prev, [postId]: 5 }));
  };

  const handleSeeMore = (postId) => {
    setVisibleComments((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 5) + 5,
    }));
  };

  const handleAddComment = async (postId) => {
    const token = localStorage.getItem('token');
    const comment = newComments[postId];
    if (!comment) return;

    try {
      const response = await axios.post(
        `${backendURL}/api/post/comment/${postId}`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment = response.data.comment;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );

      setNewComments((prev) => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 bg-gray-100 min-h-screen">
      {posts.map((post) => {
        const user = userInfoMap[post.userId] || {};
        const visibleCount = visibleComments[post._id] || 5;

        return (
          <div
            key={post._id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md transition hover:shadow-lg"
          >
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user.profilePic || '/profilepic.png'}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border border-[#1F7D53]"
              />
              <span className="font-semibold text-gray-800">
                {user.name || 'Unknown User'}
              </span>
            </div>

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
                onClick={() => handleLike(post._id)}
                className="flex items-center gap-2 hover:text-red-500 transition"
              >
                {likedPosts.has(post._id) ? (
                  <AiFillHeart size={24} className="text-red-500" />
                ) : (
                  <AiOutlineHeart size={24} className="text-gray-400" />
                )}
                <span className="text-sm">{post.likes.length} Likes</span>
              </button>
              <button
                onClick={() => toggleComments(post._id)}
                className="flex items-center gap-2 hover:text-blue-500 transition"
              >
                <BiCommentDetail size={24} className="text-gray-400" />
                <span className="text-sm">{post.comments.length} Comments</span>
              </button>
            </div>

            {/* Comments Section */}
            {commentBoxes[post._id] && (
              <div className="mt-4 space-y-2">
                {post.comments.slice(0, visibleCount).map((cmt, idx) => {
                  const commenter = userInfoMap[cmt.userId] || {};
                  return (
                    <div key={idx} className="flex gap-3 items-start">
                      <img
                        src={commenter.profilePic || '/profilepic.png'}
                        alt="Commenter"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="bg-green-50 p-2 rounded-xl border-l-4 border-green-300 flex-1">
                        <span className="font-semibold text-sm text-gray-800">
                          {commenter.name || 'User'}:
                        </span>{' '}
                        <span className="text-sm text-gray-700">{cmt.text}</span>
                      </div>
                    </div>
                  );
                })}

                {/* See More Button */}
                {post.comments.length > visibleCount && (
                  <button
                    onClick={() => handleSeeMore(post._id)}
                    className="text-sm text-blue-600 hover:underline ml-12"
                  >
                    See more comments
                  </button>
                )}

                {/* Add Comment Box */}
                <div className="flex gap-3 items-center mt-2">
                  <input
                    type="text"
                    value={newComments[post._id] || ''}
                    onChange={(e) =>
                      setNewComments({ ...newComments, [post._id]: e.target.value })
                    }
                    placeholder="Write a comment..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button
                    onClick={() => handleAddComment(post._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};



export default Profile_posts;

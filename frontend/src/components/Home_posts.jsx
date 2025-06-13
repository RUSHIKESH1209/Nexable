import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Home_posts = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const [posts, setPosts] = useState([]);
  const [userInfoMap, setUserInfoMap] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentBoxes, setCommentBoxes] = useState({});
  const [newComments, setNewComments] = useState({});

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { setProfileUserId } = useContext(ShopContext);

  const handleProfileClick = (userId) => {
    setProfileUserId(userId);
    navigate('/profile');
  };

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      try {
        const { data: profileData } = await axios.get(`${backendURL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentUserData = profileData.user;
        setCurrentUser(currentUserData);
        const connections = currentUserData.connections || [];

        const { data: postData } = await axios.get(`${backendURL}/api/post/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allPosts = postData.posts || [];

        const filteredPosts = allPosts.filter(post => connections.includes(post.userId));
        setPosts(filteredPosts);

        const userIds = new Set();
        filteredPosts.forEach(post => {
          userIds.add(post.userId);
          post.comments.forEach(c => userIds.add(c.userId));
        });

        const userMap = {};
        for (const id of userIds) {
          const res = await axios.get(`${backendURL}/api/user/profile/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          userMap[id] = res.data.user;
        }

        setUserInfoMap(userMap);

        const liked = new Set();
        filteredPosts.forEach(post => {
          if (post.likes.includes(currentUserData._id)) {
            liked.add(post._id);
          }
        });
        setLikedPosts(liked);
      } catch (err) {
        console.error('Error fetching posts or user data:', err);
      }
    };

    if (token) fetchPostsAndUsers();
  }, [backendURL, token]);

  const handleLike = async (postId) => {
    try {
      const isLiked = likedPosts.has(postId);

      await axios.post(`${backendURL}/api/post/postlikes/${postId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedLikedPosts = new Set(likedPosts);
      if (isLiked) {
        updatedLikedPosts.delete(postId);
      } else {
        updatedLikedPosts.add(postId);
      }
      setLikedPosts(updatedLikedPosts);

      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? {
              ...post,
              likes: isLiked
                ? post.likes.filter(id => id !== currentUser?._id)
                : [...post.likes, currentUser?._id],
            }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const toggleComments = (postId) => {
    setCommentBoxes(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = async (postId) => {
    const text = newComments[postId];
    if (!text?.trim()) return;

    try {
      await axios.post(
        `${backendURL}/api/post/comment/${postId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPosts = posts.map(post =>
        post._id === postId
          ? {
            ...post,
            comments: [
              ...post.comments,
              {
                userId: currentUser._id,
                text,
                createdAt: new Date().toISOString(),
              },
            ],
          }
          : post
      );

      setPosts(updatedPosts);
      setNewComments(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  return (
    <div className="space-y-8">
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 text-sm mt-10">
          No posts from your connections yet.
        </div>
      ) : (
        posts.map((post) => {
          const user = userInfoMap[post.userId] || {};
          return (
            <div
              key={post._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md transition hover:shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => handleProfileClick(post.userId)}>
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

              {commentBoxes[post._id] && (
                <div className="mt-5">
                  <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                    {post.comments.map((cmt, idx) => {
                      const commenter = userInfoMap[cmt.userId] || {};
                      return (
                        <div key={idx} className="flex gap-3 items-start">
                          <img
                            src={commenter.profilePic || '/profilepic.png'}
                            alt="Commenter"
                            className="w-8 h-8 rounded-full object-cover border border-gray-300 cursor-pointer"
                            onClick={() => handleProfileClick(cmt.userId)}
                          />
                          <div className="flex-1 bg-gray-50 p-3 rounded-2xl shadow-sm">
                            <p className="text-sm">
                              <span
                                className="font-semibold text-gray-800 cursor-pointer"
                                onClick={() => handleProfileClick(cmt.userId)}
                              >
                                {commenter.name || 'User'}
                              </span>
                              <span className="ml-1 text-gray-700">{cmt.text}</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    <img
                      src={currentUser?.profilePic || '/profilepic.png'}
                      alt="You"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                    <input
                      type="text"
                      value={newComments[post._id] || ''}
                      onChange={(e) =>
                        setNewComments({ ...newComments, [post._id]: e.target.value })
                      }
                      placeholder="Add a comment..."
                      className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus-within:ring-[#7494ec]"
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="bg-[#7494ec] text-white px-4 py-2 rounded-full text-sm hover:bg-[#6b8fd4] transition"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Home_posts;
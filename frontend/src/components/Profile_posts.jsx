import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const UserPosts = ({ userId }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [userInfoMap, setUserInfoMap] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [commentBoxes, setCommentBoxes] = useState({});
  const [newComments, setNewComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      setLoading(true);
      setError(null);
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }
      if (!userId) {
        setError("User ID not provided to fetch posts.");
        setLoading(false);
        return;
      }

      try {
        const { data: postData } = await axios.get(`${backendURL}/api/post/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filteredPosts = postData.posts?.filter(post => post.userId === userId) || [];
        setPosts(filteredPosts);

        const userIdsToFetch = new Set();
        userIdsToFetch.add(userId);
        if (currentUserId) userIdsToFetch.add(currentUserId);

        filteredPosts.forEach(post => {
          post.comments.forEach(c => userIdsToFetch.add(c.userId));
        });

        const userMap = {};
        for (const id of userIdsToFetch) {
          if (id) {
            const res = await axios.get(`${backendURL}/api/user/profile/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            userMap[id] = res.data.user;
          }
        }
        setUserInfoMap(userMap);

        if (currentUserId) {
          setCurrentUser(userMap[currentUserId]);
        }

        const liked = new Set();
        filteredPosts.forEach(post => {
          if (post.likes.includes(currentUserId)) {
            liked.add(post._id);
          }
        });
        setLikedPosts(liked);
      } catch (err) {
        console.error('Error fetching posts or users:', err);
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostsAndUsers();
  }, [backendURL, token, userId, currentUserId]);

  const handleLike = async (postId) => {
    if (!currentUser) {
      console.warn("Cannot like: User not logged in.");
      return;
    }
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
    if (!text?.trim() || !currentUser) return;

    try {
      const response = await axios.post(
        `${backendURL}/api/post/comment/${postId}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newComment = response.data.comment || {
        userId: currentUserId,
        text,
        createdAt: new Date().toISOString(),
      };


      const updatedPosts = posts.map(post =>
        post._id === postId
          ? {
            ...post,
            comments: [
              ...post.comments,
              {
                userId: newComment.userId,
                text: newComment.text,
                createdAt: newComment.createdAt,
              },
            ],
          }
          : post
      );

      if (!userInfoMap[currentUserId] && currentUser) {
        setUserInfoMap(prev => ({ ...prev, [currentUserId]: currentUser }));
      }

      setPosts(updatedPosts);
      setNewComments(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleProfileClick = (id) => {
    if (id === currentUserId) {
      navigate('/profile');
    } else {
      navigate(`/profile/${id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[300px] w-full max-w-2xl mx-auto">
        <div className="w-16 h-16 border-4 border-[#1F7D53] border-dashed rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-semibold text-gray-700">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[300px] w-full max-w-2xl mx-auto text-red-600 text-center">
        <BiCommentDetail size={48} className="text-red-500 mb-4" />
        <p className="text-xl font-semibold">{error}</p>
        <p className="text-md text-gray-500 mt-2">Please check your connection or try again later.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[300px] w-full max-w-2xl mx-auto text-gray-600 text-center">
        <AiOutlineHeart size={48} className="text-gray-400 mb-4" />
        <p className="text-xl font-semibold">No posts to display for this user yet.</p>
        <p className="text-md text-gray-500 mt-2">Check back later or connect with them!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-2xl mx-auto p-4">
      {posts.map((post) => {
        const postUser = userInfoMap[post.userId] || {};
        return (
          <div
            key={post._id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md transition hover:shadow-lg"
          >
            <div
              className="flex items-center gap-3 mb-4 cursor-pointer"
              onClick={() => handleProfileClick(post.userId)}
            >
              <img
                src={postUser.profilePic || '/profilepic.png'}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border border-[#1F7D53]"
              />
              <span className="font-semibold text-gray-800">
                {postUser.name || 'Unknown User'}
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
                      <div key={cmt._id || idx} className="flex gap-3 items-start">
                        <img
                          src={commenter.profilePic || '/profilepic.png'}
                          alt="Commenter"
                          className="w-8 h-8 rounded-full object-cover border border-green-500 cursor-pointer"
                          onClick={() => handleProfileClick(cmt.userId)}
                        />
                        <div className="flex-1 bg-gray-50 p-3 rounded-2xl shadow-sm">
                          <p className="text-sm">
                            <span
                              className="font-semibold text-gray-800 cursor-pointer hover:underline"
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
                    className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button
                    onClick={() => handleAddComment(post._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-full text-sm hover:bg-green-700 transition"
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

export default UserPosts;
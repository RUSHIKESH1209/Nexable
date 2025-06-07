import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';

const Profile_posts = () => {
  
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  
    const [posts, setPosts] = useState([]);
    const [userInfoMap, setUserInfoMap] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [commentBoxes, setCommentBoxes] = useState({});
    const [newComments, setNewComments] = useState({});
    const [visibleCount, setVisibleCount] = useState(2);
  
    const token = localStorage.getItem('token');
  
    useEffect(() => {
      const fetchPostsAndUsers = async () => {
        try {
          const { data: postData } = await axios.get(`${backendURL}/api/post/posts`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          setPosts(postData.posts || []);
  
          const userIds = new Set();
          postData.posts.forEach(post => {
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
  
          const currentUserId = JSON.parse(atob(token.split('.')[1])).id;
          if (!userMap[currentUserId]) {
            const meRes = await axios.get(`${backendURL}/api/user/profile/${currentUserId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            userMap[currentUserId] = meRes.data.user;
            setCurrentUser(meRes.data.user);
          } else {
            setCurrentUser(userMap[currentUserId]);
          }
  
          setUserInfoMap(userMap);
        } catch (err) {
          console.error('Error fetching posts or users:', err);
        }
      };
  
      fetchPostsAndUsers();
    }, []);
  
    const handleLike = async (postId) => {
      try {
        await axios.post(`${backendURL}/api/post/like/${postId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        setLikedPosts(prev =>
          new Set(prev.has(postId) ? [...prev].filter(id => id !== postId) : [...prev, postId])
        );
  
        setPosts(prev =>
          prev.map(post =>
            post._id === postId
              ? {
                  ...post,
                  likes: likedPosts.has(postId)
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
  
    const handleSeeMore = () => {
      setVisibleCount(prev => prev + 3);
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
  
        const userId = JSON.parse(atob(token.split('.')[1])).id;
  
        const updatedPosts = posts.map(post =>
          post._id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    userId,
                    text,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : post
        );
  
        if (!userInfoMap[userId] && currentUser) {
          setUserInfoMap(prev => ({ ...prev, [userId]: currentUser }));
        }
  
        setPosts(updatedPosts);
        setNewComments(prev => ({ ...prev, [postId]: '' }));
      } catch (err) {
        console.error('Failed to add comment:', err);
      }
    };
  
    return (
      <div className="space-y-8">
        {posts.map((post) => {
          const user = userInfoMap[post.userId] || {};
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
  
                  {post.comments.length > visibleCount && (
                    <button
                      onClick={handleSeeMore}
                      className="text-sm text-blue-600 hover:underline ml-12"
                    >
                      See more comments
                    </button>
                  )}
  
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

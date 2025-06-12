import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FaCommentDots, FaUserTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Connections_item = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');

  const { setProfileUserId } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      try {
        const profileRes = await axios.get(`${backendURL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const connectionIds = profileRes.data.user.connections || [];

        const connectionDataPromises = connectionIds.map(async (id) => {
          try {
            const userRes = await axios.get(`${backendURL}/api/user/profile/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return userRes.data.user;
          } catch (error) {
            console.error(`Failed to fetch profile for ID ${id}:`, error);
            return null;
          }
        });

        const connectionData = (await Promise.all(connectionDataPromises)).filter(Boolean);
        setConnections(connectionData);
      } catch (error) {
        console.error('Failed to fetch connections:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchConnections();
    } else {
      setLoading(false);
    }
  }, [backendURL, token]);

  const handleRemove = async (connectionId) => {
    const originalConnections = connections;
    setConnections((prev) => prev.filter((user) => user._id !== connectionId));

    try {
      await axios.post(
        `${backendURL}/api/user/updateConnections`,
        { connectionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error removing connection:', error);
      alert('Failed to remove connection. Please try again.');
      setConnections(originalConnections);
    }
  };

  const handleMessage = (userId) => {
    window.location.href = `/chat/${userId}`;
  };

  const handleProfileClick = (userId) => {
    setProfileUserId(userId);
    navigate('/profile');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-3xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-[#333] mb-6 text-center">Your Connections</h2>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7494ec]"></div>
        </div>
      ) : connections.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {connections.map((user) => (
              <motion.div
                key={user._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200/80 hover:bg-white hover:border-[#7494ec] transition-all duration-300"
              >
                <div
                  className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
                  onClick={() => handleProfileClick(user._id)}
                >
                  <img
                    src={user.profilePic || '/profilepic.png'}
                    alt={user.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#7494ec]"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#333] truncate">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-2 sm:ml-4 flex-shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#e5edff' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMessage(user._id)}
                    className="p-2 sm:p-3 rounded-full text-[#7494ec] bg-[#e6edff] border border-[#c9d7ff] transition-colors duration-200"
                    aria-label="Message"
                  >
                    <FaCommentDots className="text-lg" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: '#ffe5e5' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemove(user._id)}
                    className="p-2 sm:p-3 rounded-full text-red-500 bg-red-50 border border-red-200 transition-colors duration-200"
                    aria-label="Remove"
                  >
                    <FaUserTimes className="text-lg" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <p className="text-xl text-gray-700 font-semibold mb-2">No Connections Found</p>
          <p className="text-gray-500">Start networking to see your connections here.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Connections_item;
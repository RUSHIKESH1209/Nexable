import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserTimes, FaCommentDots } from 'react-icons/fa'; // Updated icons for better visual fit
import { motion, AnimatePresence } from 'framer-motion';

const Connections_item = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');

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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} // Matched initial animation from createpost
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }} // Matched transition from createpost
      className="bg-white rounded-[30px] p-6 shadow-2xl flex flex-col" // Matched card styling
    >
      <h2 className="text-2xl font-bold text-[#7494ec] mb-6 text-center">Your Connections</h2> {/* Larger, matching title style */}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#7494ec]"></div> {/* Loader color matched */}
        </div>
      ) : connections.length > 0 ? (
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {connections.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#f9f9f9] hover:bg-[#eeeeee] transition-all duration-200 border border-gray-100" // Matched background and border
              >
                <div className="flex items-center gap-4"> {/* Increased gap for more space */}
                  <img
                    src={user.profilePic || '/profilepic.png'}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#7494ec] shadow-sm" // Matched profile pic border color
                  />
                  <div>
                    <p className="font-semibold text-base text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500 truncate w-40 sm:w-auto">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3"> {/* Increased gap between buttons */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMessage(user._id)}
                    className="bg-[#7494ec] text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#607bb0] transition-colors duration-200 shadow-md" // Matched primary button style
                  >
                    <FaCommentDots className="text-lg" />
                    <span className="hidden md:inline">Message</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemove(user._id)}
                    className="bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-red-600 transition-colors duration-200 shadow-md" // Standard red for delete
                  >
                    <FaUserTimes className="text-lg" />
                    <span className="hidden md:inline">Remove</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-8 bg-[#f9f9f9] rounded-lg border border-dashed border-gray-200"> {/* Matched empty state background */}
          <p className="text-lg text-gray-600 font-medium mb-2">No connections yet!</p>
          <p className="text-sm text-gray-500">Start connecting with others to see them here.</p>
        </div>
      )}
    </motion.div>
  );
};

export default Connections_item;
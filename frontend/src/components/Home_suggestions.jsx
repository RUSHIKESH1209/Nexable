import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Home_suggestions = () => {
  const [users, setUsers] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');

  const { setProfileUserId } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/user/suggestions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch suggested users:', err);
      }
    };

    fetchSuggestions();
  }, [backendURL, token]);

  const handleConnection = async (userId) => {
    try {
      const response = await axios.post(
        `${backendURL}/api/user/updateConnections`,
        { connectionId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
      }
      toast.success('Connection successful', { autoClose: 500 })

    } catch (err) {
      console.error('Connection failed:', err);
      toast.error('Failed to connect');
    }
  };

  const handleProfileClick = (userId) => {
    setProfileUserId(userId);
    navigate('/profile');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-[30px] p-6 shadow-2xl"
    >
      <h2 className="text-xl font-bold text-[#333] mb-4">Suggested People</h2>
      {users.length ? (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 pb-4 border-b border-[#eee] last:border-b-0"
            >
              <img
                src={user.profilePic || '/profilepic.png'}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover  cursor-pointer"
                onClick={() => handleProfileClick(user._id)}
              />
              <div className="flex-1 flex flex-col">
                <p
                  className="font-semibold text-base text-[#333] mb-1 cursor-pointer"
                  onClick={() => handleProfileClick(user._id)}
                >
                  {user.name}
                </p>
                <div className="flex gap-2 mt-1 sm:mt-0">
                  <button
                    onClick={() => navigate(`/chat/${user._id}`)}
                    className="bg-[#dbe6ff] text-[#7494ec] px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#c6d7fb] transition"
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => handleConnection(user._id)}
                    className="bg-[#7494ec] text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#5c73c9] transition"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[#888] text-sm">No suggestions available at the moment.</p>
      )}
    </motion.div>
  );
};

export default Home_suggestions;

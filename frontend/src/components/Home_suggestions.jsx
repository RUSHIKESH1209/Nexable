import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Home_suggestions = () => { // Renamed component
  const [users, setUsers] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');

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
  }, []);

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
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }} // Slight delay for stagger effect
      className="bg-white rounded-[30px] p-6 shadow-2xl" // Consistent card styling
    >
      <h2 className="text-xl font-bold text-[#333] mb-4">Suggested People</h2> {/* Consistent heading style */}
      {users.length ? (
        <div className="space-y-4"> {/* Spacing between suggested users */}
          {users.map((user) => (
            <div key={user._id} className="flex items-center gap-4 pb-4 border-b border-[#eee] last:border-b-0"> {/* Separator */}
              <img
                src={user.profilePic || '/profilepic.png'}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#7494ec]" // Nexable border
              />
              <div>
                <p className="font-semibold text-base text-[#333] mb-1">{user.name}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.location.href = `/chat/${user._id}`}
                    className="bg-[#7494ec] text-white px-4 py-1.5 rounded-lg text-sm hover:bg-[#607bb0] transition" // Nexable button
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => handleConnection(user._id)}
                    className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition" // Default blue for 'Connect'
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
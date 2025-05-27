// Home_suggestions.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserPlus } from 'react-icons/fa';

// Dummy data for development
const dummySuggestions = [
  {
    id: 1,
    name: 'Amit Verma',
    username: 'amitv',
    profilePic: '/profilepic.png',
  },
  {
    id: 2,
    name: 'Sneha Reddy',
    username: 'sneha_r',
    profilePic: '/profilepic.png',
  },
  {
    id: 3,
    name: 'Ravi Kumar',
    username: 'ravik',
    profilePic: '/profilepic.png',
  },
];

const Home_suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // 👉 Uncomment this block once your backend is ready
    /*
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get('/api/user/suggestions', {
          withCredentials: true,
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
    */

    // 👇 Dummy data for testing
    setSuggestions(dummySuggestions);
  }, []);

  const handleConnect = async (userId) => {
    // 👉 Uncomment this block once your backend is ready
    /*
    try {
      const response = await axios.post(`/api/user/connect/${userId}`, {}, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setSuggestions((prev) => prev.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error('Error connecting to user:', error);
    }
    */

    // 👇 Dummy removal
    setSuggestions((prev) => prev.filter((user) => user.id !== userId));
  };

  return (
    <div className="bg-white border border-[#1F7D53] rounded-xl p-4 shadow flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-[#255F38] mb-2">Suggestions</h2>
      {suggestions.length > 0 ? (
        suggestions.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
            <div className="flex items-center gap-3">
              <img
                src={user.profilePic || '/profilepic.png'}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-300"
              />
              <div>
                <p className="font-medium text-sm text-[#1F7D53]">{user.name}</p>
                <p className="text-xs text-gray-500">@{user.username}</p>
              </div>
            </div>
            <button
              onClick={() => handleConnect(user.id)}
              className="bg-[#EC5228] text-white px-3 py-1 rounded-md text-xs flex items-center gap-1 hover:bg-opacity-90"
            >
              <FaUserPlus /> 
            </button>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No suggestions right now.</p>
      )}
    </div>
  );
};

export default Home_suggestions;

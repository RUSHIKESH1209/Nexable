import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEnvelope } from 'react-icons/fa';

const Connections_item = () => {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        // Uncomment this when backend is ready
        // const response = await axios.get('/api/user/connections', {
        //   withCredentials: true,
        // });
        // setConnections(response.data);

        // Dummy data
        setConnections([
          {
            id: 1,
            name: 'Riya Kapoor',
            username: 'riya.kapoor',
            profilePic: '/profilepic.png',
          },
          {
            id: 2,
            name: 'Arjun Mehta',
            username: 'arjun.m',
            profilePic: '/login.png',
          },
          {
            id: 3,
            name: 'Simran Gupta',
            username: 'simran.g',
            profilePic: '/profilepic.png',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch connections:', error);
      }
    };

    fetchConnections();
  }, []);

  const handleRemove = async (userId) => {
    try {
      // Uncomment when backend is ready
      // await axios.delete(`/api/user/connections/${userId}`, {
      //   withCredentials: true,
      // });

      setConnections((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error removing connection:', error);
    }
  };

  const handleMessage = (userId) => {
    console.log('Message user with ID:', userId);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-[#EC5228] shadow-sm">
      <h2 className="text-lg font-semibold text-[#EC5228] mb-3">Your Connections</h2>
      {connections.length > 0 ? (
        <div className="flex flex-col gap-4">
          {connections.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-4 p-2 rounded-md hover:bg-[#fbe6df] transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profilePic || '/profilepic.png'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <p className="font-medium text-sm text-[#EC5228]">{user.name}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleMessage(user.id)}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-xs flex items-center gap-2 hover:bg-green-200 transition-colors"
                >
                  <FaEnvelope className="text-sm" /> Message
                </button>
                <button
                  onClick={() => handleRemove(user.id)}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-xs flex items-center gap-2 hover:bg-red-200 transition-colors"
                >
                  <FaTrash className="text-sm" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No connections found.</p>
      )}
    </div>
  );
};

export default Connections_item;

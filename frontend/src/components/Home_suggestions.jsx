import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [connections, setConnections] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        if (!token) {
          console.error('No token found');
          return;
        }

        // Decode token to get current user ID
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(decoded.id);

        // Get current user profile (to get their existing connections)
        const meRes = await axios.get(`${backendURL}/api/user/profile/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConnections(meRes.data.user.connections || []);

        // Fetch all users
        const response = await axios.get(`${backendURL}/api/user/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchAllUsers();
  }, []);

  const handleConnectionToggle = async (connectionId) => {
    try {
      const res = await axios.post(
        `${backendURL}/api/user/updateConnections`,
        { connectionId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        // Toggle connection locally
        setConnections(prev =>
          prev.includes(connectionId)
            ? prev.filter(id => id !== connectionId)
            : [...prev, connectionId]
        );
      }
    } catch (err) {
      console.error('Error updating connection:', err);
    }
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow">
      <h2 className="text-xl font-semibold text-[#1F7D53] mb-4">All Users</h2>
      {users.length > 0 ? (
        users.map((user) =>
          user._id !== currentUserId ? (
            <div key={user._id} className="flex items-center gap-4 mb-4">
              <img
                src={user.profilePic || '/profilepic.png'}
                alt={user.name}
                className="w-10 h-10 rounded-full border object-cover"
              />
              <div>
                <p className="font-semibold text-sm text-[#1F7D53]">{user.name}</p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => window.location.href = `/chat/${user._id}`}
                    className="bg-[#1F7D53] text-white px-3 py-1 rounded text-xs"
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => handleConnectionToggle(user._id)}
                    className={`${
                      connections.includes(user._id) ? 'bg-red-500' : 'bg-blue-600'
                    } text-white px-3 py-1 rounded text-xs`}
                  >
                    {connections.includes(user._id) ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          ) : null
        )
      ) : (
        <p className="text-gray-500 text-sm">No other users found.</p>
      )}
    </div>
  );
};

export default AllUsers;

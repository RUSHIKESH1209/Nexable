// Profile_template.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile_template = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${backendURL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="bg-white shadow rounded-xl p-6 border mx-4 my-4">
      <div className="flex items-center gap-4">
        <img
          src={user.profilePic || '/profilepic.png'}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border border-[#1F7D53]"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.position} at {user.company}</p>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-700">
        <p><strong>About:</strong> {user.about || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
        <p><strong>Address:</strong> {user.address || 'N/A'}</p>
        <p><strong>Skills:</strong> {user.skills?.join(', ') || 'N/A'}</p>
      </div>
    </div>
  );
};

export default Profile_template;
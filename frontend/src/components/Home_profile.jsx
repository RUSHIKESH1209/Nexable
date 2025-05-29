import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home_profile = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authorization token found. Please login.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${backendURL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setProfile(response.data.user);
        } else {
          setError('Failed to load profile');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#1F7D53] w-full max-w-md mx-auto">
      <div className="flex flex-col items-center mb-4">
        <img
          src={profile.profilePic || '/profilepic.png'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-[#1F7D53] mb-2"
        />
        <h2 className="text-lg font-semibold text-black">{profile.name || 'No Name'}</h2>
        <h3 className="text-md font-bold text-[#1F7D53]">{profile.position || ''}</h3>
        <p className="text-sm text-[#EC5228]">{profile.company || ''}</p>
      </div>

      <p className="mb-4 text-sm font-extralight text-gray-600">{profile.about || ''}</p>

      <div className="mb-4 text-sm text-black">
        <strong className="text-[#EC5228]">Contact:</strong>
        <p>{profile.phone || 'N/A'}</p>
        <p>{profile.email || 'N/A'}</p>
        <p>{profile.address || 'N/A'}</p>
      </div>

      <div>
        <strong className="text-[#EC5228]">Skills:</strong>
        <div className="flex flex-wrap gap-2 mt-2">
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill, i) => (
              <span key={i} className="bg-[#1F7D53] text-white text-sm px-3 py-1 rounded-full">
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">No skills listed</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home_profile;

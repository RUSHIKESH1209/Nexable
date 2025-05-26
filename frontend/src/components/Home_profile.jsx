// Home_profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home_profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Demo data until backend is ready
        const demoData = {
          profilePic: '/profilepic.png',
          about: 'Creative and detail-oriented full stack developer experienced in building scalable web applications.',
          phone: '+1234567890',
          address: '123 Developer Lane, Tech City',
          email: 'dev@example.com',
          skills: ['React', 'Node.js', 'MongoDB', 'Express'],
          position: 'Software Engineer',
          company: 'Tech Corp'
        };
        setProfile(demoData);

        // Uncomment when backend is available
        // const response = await axios.get('/api/user/getprofile');
        // setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#1F7D53] w-full">
      <div className="flex flex-col items-center mb-4">
        <img
          src={profile.profilePic || '/profilepic.png'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-[#1F7D53] mb-2"
        />
        <h2 className="text-lg font-semibold text-black">John Doe</h2> {/* Static Name placeholder */}
        <h3 className="text-md font-bold text-[#1F7D53]">{profile.position}</h3>
        <p className="text-sm text-[#EC5228]">{profile.company}</p>
      </div>


      <p className="mb-4 text-sm font-extralightt text-gray-600">{profile.about}</p>

      <div className="mb-4 text-sm text-black">
        <strong className="text-[#EC5228]">Contact:</strong>
        <p>{profile.phone}</p>
        <p>{profile.email}</p>
        <p>{profile.address}</p>
      </div>

      <div>
        <strong className="text-[#EC5228]">Skills:</strong>
        <div className="flex flex-wrap gap-2 mt-2">
          {profile.skills?.map((skill, i) => (
            <span key={i} className="bg-[#1F7D53] text-white text-sm px-3 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home_profile;

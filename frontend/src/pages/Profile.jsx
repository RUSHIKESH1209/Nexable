import React from 'react';
import Profile_template from '../components/Profile_template';
import Profile_posts from '../components/Profile_posts';

const Profile = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Profile_template />
      <Profile_posts />
    </div>
  );
};

export default Profile;

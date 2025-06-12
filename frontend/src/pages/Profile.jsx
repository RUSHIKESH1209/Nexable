import React from 'react';
import Profile_template from '../components/Profile_template';
import UserPosts from '../components/Profile_posts'; 

const Profile = ({ userId }) => {
  const token = localStorage.getItem('token');
  const currentUserId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  const displayUserId = userId || currentUserId;

  if (!displayUserId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
        Please log in or provide a user ID to view a profile.
      </div>
    );
  }

  return (
    <>
      <Profile_template userId={displayUserId} />
      <UserPosts userId={displayUserId} />
    </>
  );
};

export default Profile;
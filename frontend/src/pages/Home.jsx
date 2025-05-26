// Home.js
import React from 'react';
import Home_profile from '../components/Home_profile';
import Home_createpost from '../components/Home_createpost';
import Home_posts from '../components/Home_posts';
import Home_suggestions from '../components/Home_suggestions';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#EFEFEF] px-[5%] py-6 border-4 border-dashed border-gray-400">
      <div className="flex flex-row gap-6">
        {/* Left - Profile Section (20%) */}
        <div className="w-[20%] border border-red-400 p-2">
          <Home_profile />
        </div>

        {/* Center - Create Post and Posts (55%) */}
        <div className="w-[55%] flex flex-col gap-4">
          <div className="border border-yellow-400 p-2">
            <Home_createpost />
          </div>
          <div className="border border-purple-400 p-2">
            <Home_posts />
          </div>
        </div>

        {/* Right - Suggestions Section (20%) */}
        <div className="w-[20%] border border-green-400 p-2">
          <Home_suggestions />
        </div>
      </div>
    </div>
  );
};

export default Home;

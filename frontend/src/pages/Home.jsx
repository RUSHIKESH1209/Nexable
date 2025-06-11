import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Home_profile from '../components/Home_profile';
import Home_createpost from '../components/Home_createpost';
import Home_posts from '../components/Home_posts';
import Home_suggestions from '../components/Home_suggestions';

const Home = () => {
  const { isHomeLoading } = useContext(ShopContext);

  if (isHomeLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto" />
          <p className="text-lg font-medium text-gray-700">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] p-6 md:p-4 lg:p-8"> 
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 max-w-7xl mx-auto"> 
        <div className="w-full lg:w-1/4"> 
          <Home_profile />
        </div>

        <div className="w-full lg:w-2/4 flex flex-col gap-6">
          <Home_createpost />
          <Home_posts />
        </div>

        <div className="w-full lg:w-1/4">
          <Home_suggestions />
        </div>
      </div>
    </div>
  );
};

export default Home;

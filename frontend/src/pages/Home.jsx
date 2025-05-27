// Home.js
import React from 'react';
import Home_profile from '../components/Home_profile';
import Home_createpost from '../components/Home_createpost';
import Home_posts from '../components/Home_posts';
import Home_suggestions from '../components/Home_suggestions';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#EFEFEF] px-[5%] py-6 ">
      <div className="flex flex-row gap-2">
        <div className="w-[20%]  p-2">
          <Home_profile />
        </div>

        <div className="w-[55%] flex flex-col gap-2">
          <div className="  p-2">
            <Home_createpost />
          </div>
          <div className=" p-2">
            <Home_posts />
          </div>
        </div>

        <div className="w-[20%] p-2">
          <Home_suggestions />
        </div>
      </div>
    </div>
  );
};

export default Home;

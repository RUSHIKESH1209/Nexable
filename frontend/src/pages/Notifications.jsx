import React from 'react';
import Notifications_item from '../components/Notifications_item';
import Home_suggestions from '../components/Home_suggestions';
import Home_profile from '../components/Home_profile';

const Notifications = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row gap-4 lg:gap-6 max-w-7xl mx-auto">

        <div className="hidden lg:block lg:w-1/4">
          <Home_profile />
        </div>

        <div className="w-full md:w-2/3 lg:w-2/4 flex flex-col gap-6">
          <Notifications_item />
        </div>

        <div className="hidden md:block md:w-1/3 lg:w-1/4">
          <Home_suggestions />
        </div>
      </div>
    </div>
  );
}

export default Notifications;
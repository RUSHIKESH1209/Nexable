import React from 'react'
import Notifications_item from '../components/Notifications_item'
import Home_suggestions from '../components/Home_suggestions'
import Home_profile from '../components/Home_profile'

const Notifications = () => {
  return (
    <div className="min-h-screen bg-[#EFEFEF] px-[5%] py-6 ">
      <div className="flex flex-row gap-2">
        <div className="w-[20%]  p-2">
          <Home_profile></Home_profile>
        </div>

        <div className="w-[55%] flex flex-col gap-2">
          <div className=" p-2">
            <Notifications_item></Notifications_item>
          </div>
        </div>

        <div className="w-[20%] p-2">
          <Home_suggestions></Home_suggestions>
        </div>
      </div>
    </div>
  );
}

export default Notifications






import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserPlus, FaEnvelope } from 'react-icons/fa';

const Notifications_item = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Uncomment this when backend is ready
        // const response = await axios.get('/api/user/notifications', {
        //   withCredentials: true,
        // });
        // setNotifications(response.data);

        // Dummy data
        setNotifications([
          {
            id: 1,
            type: 'connection_request',
            name: 'Riya Kapoor',
            username: 'riya.kapoor',
            profilePic: '/profilepic.png',
            time: '2h ago'
          },
          {
            id: 2,
            type: 'message',
            name: 'Arjun Mehta',
            username: 'arjun.m',
            profilePic: '/login.png',
            time: '5h ago'
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl border border-[#EC5228] shadow-sm">
      <h2 className="text-lg font-semibold text-[#EC5228] mb-3">Notifications</h2>
      {notifications.length > 0 ? (
        <div className="flex flex-col gap-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 p-2 rounded-md hover:bg-[#fbe6df] transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.profilePic}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <p className="font-medium text-sm text-[#EC5228]">
                    {item.name} {item.type === 'connection_request' ? 'sent you a connection request' : 'sent you a message'}
                  </p>
                  <p className="text-xs text-gray-500">@{item.username} • {item.time}</p>
                </div>
              </div>
              <div className="text-[#EC5228] text-lg">
                {item.type === 'connection_request' ? <FaUserPlus /> : <FaEnvelope />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No new notifications.</p>
      )}
    </div>
  );
};

export default Notifications_item;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserPlus, FaEnvelope } from 'react-icons/fa';
import moment from 'moment';

const Notifications_item = () => {
  const [notifications, setNotifications] = useState([]);
  const [senders, setSenders] = useState({}); // store sender info by id
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${backendURL}/api/notification`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setNotifications(res.data.notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    // For all sender IDs not fetched yet, fetch sender details
    const fetchSenders = async () => {
      const senderIds = [...new Set(notifications.map(n => n.sender))];
      const idsToFetch = senderIds.filter(id => !senders[id]);

      try {
        const requests = idsToFetch.map(id =>
          axios.get(`${backendURL}/api/user/profile/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        );

        const results = await Promise.all(requests);
        const newSenders = { ...senders };

        results.forEach(res => {
          if (res.data.success && res.data.user) {
            newSenders[res.data.user._id] = res.data.user;
          }
        });

        setSenders(newSenders);
      } catch (error) {
        console.error('Error fetching sender profiles:', error);
      }
    };

    if (notifications.length > 0) {
      fetchSenders();
    }
  }, [notifications]);

  const renderNotificationText = (notification) => {
    switch (notification.type) {
      case 'connection-request':
        return 'sent you a connection request';
      case 'connection-accepted':
        return 'accepted your connection request';
      case 'like':
        return 'liked your post';
      case 'comment':
        return `commented: "${notification.text || ''}"`;
      case 'message':
        return 'sent you a message';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-[#EC5228] shadow-sm max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-[#EC5228] mb-3">Notifications</h2>
      {notifications.length > 0 ? (
        <div className="flex flex-col gap-4">
          {notifications.map((item) => {
            const sender = senders[item.sender];

            return (
              <div
                key={item._id}
                className="flex items-center justify-between gap-4 p-2 rounded-md hover:bg-[#fbe6df] transition"
              >
                <div className="flex items-center gap-3">
                  {sender?.profilePic ? (
                    <img
                      src={sender.profilePic}
                      alt={sender.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold border border-gray-300">
                      {sender?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm text-[#EC5228]">
                      {sender ? sender.name : 'User'} {renderNotificationText(item)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {moment(item.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
                <div className="text-[#EC5228] text-lg">
                  {item.type === 'connection-request' || item.type === 'connection-accepted' ? (
                    <FaUserPlus />
                  ) : (
                    <FaEnvelope />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No new notifications.</p>
      )}
    </div>
  );
};

export default Notifications_item;

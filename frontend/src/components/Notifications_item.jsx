import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserPlus, FaEnvelope, FaHeart, FaCommentAlt } from 'react-icons/fa';
import moment from 'moment';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Notifications_item = () => {
  const [notifications, setNotifications] = useState([]);
  const [senders, setSenders] = useState({});
  const [loading, setLoading] = useState(true);
  const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendURL}/api/notification`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setNotifications(res.data.notifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNotifications();
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const fetchSenders = async () => {
      const senderIds = [...new Set(notifications.map(n => n.sender))];
      const idsToFetch = senderIds.filter(id => !senders[id]);

      if (idsToFetch.length === 0) return;

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
  }, [notifications, senders, backendURL, token]);

  const renderNotificationText = (notification) => {
    const sender = senders[notification.sender];
    const senderName = sender ? sender.name : 'Someone';

    switch (notification.type) {
      case 'connection':
        return <><span className="font-bold text-[#333]">{senderName}</span> connected with you.</>;
      case 'like':
        return <><span className="font-bold text-[#333]">{senderName}</span> liked your post.</>;
      case 'comment':
        return <><span className="font-bold text-[#333]">{senderName}</span> commented: "<span className="italic">{notification.text || 'No comment text'}</span>"</>;
      case 'message':
        return <><span className="font-bold text-[#333]">{senderName}</span> sent you a message.</>;
      default:
        return '';
    }
  };

  const renderNotificationIcon = (type, senderId) => {
    const iconClass = "text-[#7494ec] text-xl flex-shrink-0";

    switch (type) {
      case 'connection':
        return <FaUserPlus className={iconClass} />;
      case 'like':
        return <FaHeart className="text-red-500 text-xl flex-shrink-0" />;
      case 'comment':
        return <FaCommentAlt className={iconClass} />;
      case 'message':
        return (
          <FaEnvelope
            className={`${iconClass} cursor-pointer hover:text-green-600`}
            onClick={() => navigate(`/chat/${senderId}`)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-[30px] p-6 shadow-2xl"
    >
      <h2 className="text-xl font-bold text-[#333] mb-4">Notifications</h2>

      {loading ? (
        <div className="flex items-center justify-center min-h-[100px]">
          <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : notifications.length > 0 ? (
        <div className="flex flex-col gap-4">
          {notifications.map((item) => {
            const sender = senders[item.sender];

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between gap-4 p-3 rounded-xl cursor-pointer
                           bg-[#f9f9f9] hover:bg-[#f0f4ff] transition duration-200 ease-in-out
                           border border-gray-100"
              >
                <div className="flex items-center gap-3 flex-grow">
                  {sender?.profilePic ? (
                    <img
                      src={sender.profilePic}
                      alt={sender.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#7494ec] flex-shrink-0 shadow-sm"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#7494ec] flex items-center justify-center text-white font-bold border-2 border-[#7494ec] flex-shrink-0 shadow-sm">
                      {sender?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 leading-snug">
                      {renderNotificationText(item)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {moment(item.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
                <div className="ml-2">
                  {renderNotificationIcon(item.type, item.sender)}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-[#888] text-center py-4">No new notifications.</p>
      )}
    </motion.div>
  );
};

export default Notifications_item;

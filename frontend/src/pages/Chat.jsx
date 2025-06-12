import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaUserCircle, FaInfoCircle, FaEllipsisH } from 'react-icons/fa';
import { MdOutlineBackspace } from "react-icons/md";

const socket = io('http://localhost:3000');

// --- Helper function to format chat dates ---
const formatChatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() &&
                                  d1.getMonth() === d2.getMonth() &&
                                  d1.getDate() === d2.getDate();

    if (isSameDay(date, today)) {
        return "Today";
    } else if (isSameDay(date, yesterday)) {
        return "Yesterday";
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
};

const Chat = () => {
    const { receiverId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const [receiverUser, setReceiverUser] = useState(null);
    const [senderUser, setSenderUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isReceiverOnline, setIsReceiverOnline] = useState(false); // New state for online status
    const [onlineUsersList, setOnlineUsersList] = useState([]); // New state to track all online users

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const token = localStorage.getItem('token');
    const senderId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

    // --- Memoized grouped messages for efficient rendering ---
    const groupedMessages = useMemo(() => {
        if (!messages || messages.length === 0) return {};
        const groups = {};
        messages.forEach(msg => {
            const dateKey = new Date(msg.createdAt).toISOString().split('T')[0];
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(msg);
        });
        return groups;
    }, [messages]);

    // --- Socket.IO Effects ---
    useEffect(() => {
        if (!senderId) {
            setError("Authentication token not found. Please log in.");
            setLoading(false);
            return;
        }

        socket.emit('register', senderId);

        // Listen for current online users upon connection
        socket.on('current_online_users', (onlineUserIds) => {
            setOnlineUsersList(onlineUserIds);
            setIsReceiverOnline(onlineUserIds.includes(receiverId));
        });

        // Listen for individual user online/offline events
        socket.on('user_online', (userId) => {
            setOnlineUsersList(prev => {
                const newSet = new Set(prev);
                newSet.add(userId);
                return Array.from(newSet);
            });
        });

        socket.on('user_offline', (userId) => {
            setOnlineUsersList(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return Array.from(newSet);
            });
        });

        socket.on('receive_message', (data) => {
            // Only add message if it's for the current chat window
            if ((data.sender === receiverId && data.receiver === senderId) || (data.sender === senderId && data.receiver === receiverId)) {
                setMessages((prev) => [...prev, data]);
            }
        });

        socket.on('typing', (data) => {
            if (data.from === receiverId) {
                setTyping(true);
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                // Automatically stop typing after 2 seconds if no new typing events
                typingTimeoutRef.current = setTimeout(() => {
                    setTyping(false);
                }, 2000);
            }
        });

        socket.on('stop_typing', (data) => {
             if (data.from === receiverId) {
                setTyping(false);
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
            }
        });

        socket.on('seen', (data) => console.log(`Message seen by ${data.by}`));

        return () => {
            // Clean up socket listeners
            socket.off('register'); // Not strictly needed here, but good practice
            socket.off('current_online_users');
            socket.off('user_online');
            socket.off('user_offline');
            socket.off('receive_message');
            socket.off('typing');
            socket.off('stop_typing');
            socket.off('seen');

            // Emit unregister only if necessary, or let server handle disconnect
            // socket.emit('unregister', senderId); // This might be redundant if disconnect handles it
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [senderId, receiverId]);

    // --- Effect to update receiver's online status based on onlineUsersList ---
    useEffect(() => {
        setIsReceiverOnline(onlineUsersList.includes(receiverId));
    }, [onlineUsersList, receiverId]);


    // --- Fetch Messages & User Info ---
    useEffect(() => {
        const fetchChatData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!token || !senderId || !receiverId) {
                    setError("Missing chat participants or authentication token.");
                    setLoading(false);
                    return;
                }

                const msgRes = await axios.get(`${backendURL}/api/message/${receiverId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessages(msgRes.data);

                const senderRes = await axios.get(`${backendURL}/api/user/profile/${senderId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSenderUser(senderRes.data.user);

                const receiverRes = await axios.get(`${backendURL}/api/user/profile/${receiverId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReceiverUser(receiverRes.data.user);

                socket.emit('seen', { from: receiverId, by: senderId });
                await axios.patch(`${backendURL}/api/message/seen/${receiverId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });

            } catch (err) {
                console.error('Failed to fetch chat data:', err);
                setError('Failed to load chat. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchChatData();
    }, [receiverId, senderId, token, backendURL]);

    // --- Auto-scroll to latest message ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // --- Handle Send Message ---
    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const currentTime = new Date().toISOString(); // Get ISO string for consistent date handling
        const msgPayload = { receiver: receiverId, message: newMessage.trim(), createdAt: currentTime };

        // Optimistic UI update
        setMessages(prev => [...prev, { ...msgPayload, sender: senderId }]);
        setNewMessage('');
        socket.emit('stop_typing', { to: receiverId, from: senderId }); // Explicitly send stop_typing on send

        try {
            await axios.post(`${backendURL}/api/message`, msgPayload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // The server will then emit 'receive_message' to the receiver,
            // and the sender's UI already has the message optimistically.
        } catch (err) {
            console.error('Failed to send message:', err);
            setError('Failed to send message. Please try again.');
        }
    };

    // --- Handle Typing Indicator ---
    const handleTypingChange = (e) => {
        setNewMessage(e.target.value);
        if (e.target.value.trim().length > 0) {
            socket.emit('typing', { to: receiverId, from: senderId });
        } else {
            socket.emit('stop_typing', { to: receiverId, from: senderId });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && newMessage.trim()) {
            handleSend();
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen bg-white">
                <div className="w-16 h-16 border-4 border-[#7494ec] border-dashed rounded-full animate-spin mb-4"></div>
                <p className="text-xl font-semibold text-gray-700">Loading chat...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen bg-white text-center text-red-600 font-semibold">
                <FaInfoCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-xl">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 bg-[#7494ec] text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-[#5a7ace] transition duration-300 shadow-md flex items-center gap-2"
                >
                    <MdOutlineBackspace size={24} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
            className="flex flex-col w-full h-screen bg-white"
        >
            {/* Chat Header */}
            <div className="flex items-center p-6 border-b border-gray-100 bg-gradient-to-r from-[#e0efff] to-white shadow-sm">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 text-gray-600 hover:text-[#7494ec] transition duration-200"
                    aria-label="Back to previous page"
                >
                    <MdOutlineBackspace size={28} />
                </button>
                <img
                    src={receiverUser?.profilePic || '/profilepic.png'}
                    alt="Receiver"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#7494ec] mr-4 shadow-md"
                />
                <div>
                    <h3 className="text-xl font-bold text-[#333]">
                        {receiverUser?.name || 'Unknown User'}
                    </h3>
                    {/* Dynamic Online Status */}
                    <p className={`text-sm ${isReceiverOnline ? 'text-green-500' : 'text-gray-500'}`}>
                        {isReceiverOnline ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
                <AnimatePresence>
                    {Object.keys(groupedMessages).sort().map(dateKey => (
                        <div key={dateKey}>
                            {/* Date Separator */}
                            <div className="flex items-center justify-center my-6">
                                <span className="flex-grow border-t border-gray-200"></span>
                                <span className="px-3 text-xs text-gray-500 font-medium bg-gray-100 rounded-full py-1">
                                    {formatChatDate(dateKey)}
                                </span>
                                <span className="flex-grow border-t border-gray-200"></span>
                            </div>

                            {/* Messages for this date */}
                            {groupedMessages[dateKey].map((msg, i) => (
                                <motion.div
                                    key={msg._id || `${dateKey}-${i}`}
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.sender === senderId ? 'justify-end' : 'justify-start'} my-2`}
                                >
                                    {msg.sender !== senderId && (
                                        <img
                                            src={receiverUser?.profilePic || '/profilepic.png'}
                                            alt="Sender"
                                            className="w-8 h-8 rounded-full object-cover border border-gray-200 mr-2 flex-shrink-0 self-end"
                                        />
                                    )}
                                    <div className={`
                                        max-w-[70%] p-4 rounded-3xl relative shadow-sm
                                        ${msg.sender === senderId
                                            ? 'bg-gradient-to-br from-[#7494ec] to-[#5a7ace] text-white rounded-br-none'
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                        }
                                    `}>
                                        <p className="text-sm break-words">{msg.message}</p>
                                        <span className={`text-xs mt-1 block ${msg.sender === senderId ? 'text-blue-200' : 'text-gray-500'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ))}

                    {typing && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex justify-start items-center text-gray-500 text-sm italic mt-4"
                        >
                            <img
                                src={receiverUser?.profilePic || '/profilepic.png'}
                                alt="Typing..."
                                className="w-8 h-8 rounded-full object-cover border border-gray-200 mr-2"
                            />
                            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
                                <FaEllipsisH className="animate-pulse" />
                                <span>Typing...</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center gap-4">
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleTypingChange}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-white border border-gray-200 rounded-full px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#7494ec] shadow-sm transition"
                    placeholder="Type your message..."
                />
                <button
                    onClick={handleSend}
                    className="bg-[#7494ec] text-white w-12 h-12 rounded-full flex items-center justify-center text-xl hover:bg-[#5a7ace] transition duration-300 shadow-lg transform active:scale-95"
                    aria-label="Send message"
                >
                    <FaPaperPlane />
                </button>
            </div>
        </motion.div>
    );
};

export default Chat;
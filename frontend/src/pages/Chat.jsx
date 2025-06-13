import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client'; // Import io
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaUserCircle, FaInfoCircle, FaEllipsisH } from 'react-icons/fa';
import { MdOutlineBackspace } from "react-icons/md";

const formatChatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();

  // Set times to midnight in local time zone
  today.setHours(0, 0, 0, 0);
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const messageDate = new Date(date);
  messageDate.setHours(0, 0, 0, 0);

  if (messageDate.getTime() === today.getTime()) {
    return "Today";
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
    const [isReceiverOnline, setIsReceiverOnline] = useState(false);
    const [onlineUsersList, setOnlineUsersList] = useState([]);

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const chatContainerRef = useRef(null);

    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const token = localStorage.getItem('token');
    const senderId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

    // --- Ensure a single, stable socket instance ---
    const socket = useMemo(() => {
        // Only create a new socket if one doesn't exist
        // or if the component is being completely re-mounted.
        // This effectively makes it a singleton for the component's lifecycle.
        return io(backendURL);
    }, [backendURL]); // Dependency on backendURL, though it's likely static

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

    // --- Function to scroll to bottom with multiple fallbacks ---
    const scrollToBottom = useCallback((behavior = 'smooth') => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior });
        } else if (chatContainerRef.current) {
            const container = chatContainerRef.current;
            if (behavior === 'auto') {
                container.scrollTop = container.scrollHeight;
            } else {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    }, []); // No dependencies for this callback

    // --- Function to mark messages as seen when chat is opened or scrolled to bottom ---
    const markMessagesAsSeen = useCallback(async () => {
        const unseenMessages = messages.filter(msg =>
            msg.sender === receiverId &&
            msg.receiver === senderId &&
            !msg.seen
        );

        if (unseenMessages.length > 0) {
            try {
                console.log(`[Client] Marking messages as seen from ${receiverId} by ${senderId}`);
                socket.emit('seen', { from: receiverId, by: senderId });

                await axios.patch(`${backendURL}/api/message/seen/${receiverId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        (msg.sender === receiverId && msg.receiver === senderId && !msg.seen)
                            ? { ...msg, seen: true }
                            : msg
                    )
                );
            } catch (err) {
                console.error('Failed to mark messages as seen:', err);
            }
        }
    }, [messages, receiverId, senderId, backendURL, token, socket]); // Added socket to dependencies

    // --- Socket.IO Effects ---
    useEffect(() => {
        if (!senderId) {
            setError("Authentication token not found. Please log in.");
            setLoading(false);
            return;
        }

        // Ensure socket is connected and registered only once when component mounts
        // or when senderId/receiverId truly changes in a way that needs re-registration.
        // The `useMemo` above ensures `socket` itself is stable.
        socket.emit('register', senderId);

        const handleCurrentOnlineUsers = (onlineUserIds) => {
            setOnlineUsersList(onlineUserIds);
            setIsReceiverOnline(onlineUserIds.includes(receiverId));
        };
        socket.on('current_online_users', handleCurrentOnlineUsers);

        const handleUserOnline = (userId) => {
            setOnlineUsersList(prev => {
                const newSet = new Set(prev);
                newSet.add(userId);
                return Array.from(newSet);
            });
        };
        socket.on('user_online', handleUserOnline);

        const handleUserOffline = (userId) => {
            setOnlineUsersList(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return Array.from(newSet);
            });
        };
        socket.on('user_offline', handleUserOffline);

        const handleReceiveMessage = (data) => {
            if ((data.sender === receiverId && data.receiver === senderId) ||
                (data.sender === senderId && data.receiver === receiverId)) {
                setMessages((prev) => {
                    const newMessages = [...prev, { ...data, seen: data.seen || false }];
                    // If the newly received message is from the receiver, mark it as seen
                    if (data.sender === receiverId && data.receiver === senderId) {
                        // This timeout is crucial to allow React to render the message first
                        // before the markAsSeen call potentially triggers another render.
                        setTimeout(() => {
                            markMessagesAsSeen();
                        }, 50); // Small delay
                    }
                    return newMessages;
                });
            }
        };
        socket.on('receive_message', handleReceiveMessage);

        const handleTyping = (data) => {
            if (data.from === receiverId) {
                setTyping(true);
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
                typingTimeoutRef.current = setTimeout(() => {
                    setTyping(false);
                }, 2000);
            }
        };
        socket.on('typing', handleTyping);

        const handleStopTyping = (data) => {
            if (data.from === receiverId) {
                setTyping(false);
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }
            }
        };
        socket.on('stop_typing', handleStopTyping);

        const handleSeen = (data) => {
            console.log(`[Client] 'seen' event received:`, data);
            if (data.by === receiverId && data.from === senderId) {
                console.log(`[Client] Updating our messages as seen in chat with ${receiverId}`);
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        (msg.sender === senderId && msg.receiver === receiverId && !msg.seen)
                            ? { ...msg, seen: true }
                            : msg
                    )
                );
            }
        };
        socket.on('seen', handleSeen);

        return () => {
            // Clean up socket listeners
            socket.off('current_online_users', handleCurrentOnlineUsers);
            socket.off('user_online', handleUserOnline);
            socket.off('user_offline', handleUserOffline);
            socket.off('receive_message', handleReceiveMessage);
            socket.off('typing', handleTyping);
            socket.off('stop_typing', handleStopTyping);
            socket.off('seen', handleSeen);

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            // If the component unmounts, you might want to consider telling the server
            // that this specific socket instance is no longer interested in updates for `senderId`.
            // However, the server's 'disconnect' handles this for the socket.id.
        };
    }, [senderId, receiverId, socket, markMessagesAsSeen]); // Added socket and markMessagesAsSeen to dependencies

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
                setMessages(msgRes.data.map(msg => ({ ...msg, seen: msg.seen || false })));

                const senderRes = await axios.get(`${backendURL}/api/user/profile/${senderId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSenderUser(senderRes.data.user);

                const receiverRes = await axios.get(`${backendURL}/api/user/profile/${receiverId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReceiverUser(receiverRes.data.user);

                // Force scroll to bottom after all data is loaded
                setTimeout(() => {
                    scrollToBottom('auto');
                }, 100);

            } catch (err) {
                console.error('Failed to fetch chat data:', err);
                setError('Failed to load chat. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchChatData();
    }, [receiverId, senderId, token, backendURL, scrollToBottom]);

    // --- Mark messages as seen when chat loads or messages change ---
    useEffect(() => {
        // This useEffect is good for marking initial messages as seen.
        // The `handleReceiveMessage` now also calls `markMessagesAsSeen` for new incoming messages.
        if (!loading && messages.length > 0) {
            const timer = setTimeout(() => {
                markMessagesAsSeen();
                scrollToBottom('auto');
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [messages, loading, markMessagesAsSeen, scrollToBottom]);

    // --- Auto-scroll to latest message ---
    // This useEffect is also good for ensuring new messages cause a scroll
    useEffect(() => {
        scrollToBottom();
        const timer = setTimeout(() => scrollToBottom(), 100);
        return () => clearTimeout(timer);
    }, [messages, typing, scrollToBottom]);


    // --- Handle scroll to detect when user is at bottom ---
    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

            if (isAtBottom) {
                markMessagesAsSeen();
            }
        }
    };

    // --- Handle Send Message ---
    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const currentTime = new Date().toISOString();
        const msgPayload = {
            receiver: receiverId,
            message: newMessage.trim(),
            createdAt: currentTime,
            sender: senderId,
            seen: false
        };

        // 1. Optimistic UI update
        setMessages(prev => [...prev, msgPayload]);
        setNewMessage('');
        socket.emit('stop_typing', { to: receiverId, from: senderId });

        try {
            // 2. Persist message to DB via HTTP API
            await axios.post(`${backendURL}/api/message`, {
                receiver: receiverId,
                message: msgPayload.message,
                createdAt: msgPayload.createdAt
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // 3. Emit message via Socket.IO for real-time delivery to receiver
            console.log(`[Client] Emitting 'send_message':`, msgPayload);
            socket.emit('send_message', msgPayload);

        } catch (err) {
            console.error('Failed to send message:', err);
            setError('Failed to send message. Please try again.');
            // Simple rollback for optimistic update
            setMessages(prev => prev.filter(msg => msg !== msgPayload));
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
                    <p className={`text-sm ${isReceiverOnline ? 'text-green-500' : 'text-gray-500'}`}>
                        {isReceiverOnline ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={chatContainerRef}
                className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar"
                onScroll={handleScroll}
                style={{ scrollBehavior: 'smooth' }}
            >
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
                                        <div className={`text-xs mt-1 flex items-center justify-between ${msg.sender === senderId ? 'text-blue-200' : 'text-gray-500'}`}>
                                            <span>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {msg.sender === senderId && (
                                                <span className="ml-2">
                                                    {msg.seen ? (
                                                        <span className="text-white font-bold text-sm">✓✓</span>
                                                    ) : (
                                                        <span className="text-blue-300 font-bold text-sm">✓</span>
                                                    )}
                                                </span>
                                            )}
                                        </div>
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
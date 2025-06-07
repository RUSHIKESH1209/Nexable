import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const Chat = () => {
  const { receiverId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);

  const token = localStorage.getItem('token');
  const senderId = JSON.parse(atob(token.split('.')[1])).id;

  useEffect(() => {
    socket.emit('register', senderId);

    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('typing', () => setTyping(true));
    socket.on('seen', () => console.log('Message seen'));

    return () => socket.disconnect();
  }, [senderId]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/message/${receiverId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setMessages(res.data));
  }, [receiverId]);

  useEffect(() => {
    socket.emit('seen', { from: receiverId });
    axios.patch(`http://localhost:3000/api/message/seen/${receiverId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [receiverId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const msg = { receiver: receiverId, message: newMessage };
    socket.emit('send_message', { ...msg, sender: senderId });
    setMessages(prev => [...prev, { ...msg, sender: senderId }]);
    setNewMessage('');

    await axios.post(`http://localhost:3000/api/message`, msg, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const handleTyping = () => {
    socket.emit('typing', { to: receiverId });
  };

  return (
    <div className="p-4">
      <div className="h-[400px] overflow-y-auto border p-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`text-sm ${msg.sender === senderId ? 'text-right' : 'text-left'}`}>
            {msg.message}
          </div>
        ))}
        {typing && <p className="text-xs italic text-gray-500">Typing...</p>}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={handleTyping}
        className="border p-2 rounded w-full"
        placeholder="Type your message..."
      />
      <button onClick={handleSend} className="bg-green-600 text-white mt-2 px-4 py-1 rounded">Send</button>
    </div>
  );
};

export default Chat;

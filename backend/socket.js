import { Server } from 'socket.io';

const usersOnline = new Map();

export default function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id); 
    let connectedUserId = null;

    socket.on('register', (userId) => {
      connectedUserId = userId;

      if (!usersOnline.has(userId)) {
        usersOnline.set(userId, new Set());
        io.emit('user_online', userId);
        console.log(`User ${userId} came online. Total distinct users online: ${usersOnline.size}`);
      }
      usersOnline.get(userId).add(socket.id);
      console.log(`Socket ${socket.id} registered for User ${userId}. User's sockets: ${usersOnline.get(userId).size}`);

      const currentOnlineUserIds = Array.from(usersOnline.keys());
      socket.emit('current_online_users', currentOnlineUserIds);
    });



    socket.on('send_message', ({ sender, receiver, message, createdAt }) => {
      const receiverSockets = usersOnline.get(receiver);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('receive_message', { sender, receiver, message, createdAt, seen: false });
        });
      }
    });

    socket.on('typing', ({ to, from }) => {
      const receiverSockets = usersOnline.get(to);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('typing', { from });
        });
      }
    });

    socket.on('stop_typing', ({ to, from }) => {
      const receiverSockets = usersOnline.get(to);
      if (receiverSockets) {
        receiverSockets.forEach(socketId => {
          io.to(socketId).emit('stop_typing', { from });
        });
      }
    });

    socket.on('seen', ({ from, by }) => {
      console.log(`[Server] User ${by} has seen messages from ${from}`);

      const senderSockets = usersOnline.get(from);
      if (senderSockets) {
        senderSockets.forEach(socketId => {
          io.to(socketId).emit('seen', { by, from });
        });
        console.log(`[Server] Notified ${from} that ${by} has seen their messages`);
      }
    });


    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      if (connectedUserId && usersOnline.has(connectedUserId)) {
        usersOnline.get(connectedUserId).delete(socket.id);
        if (usersOnline.get(connectedUserId).size === 0) {
          usersOnline.delete(connectedUserId);
          io.emit('user_offline', connectedUserId);
          console.log(`User ${connectedUserId} went offline. Total distinct users online: ${usersOnline.size}`);
        }
      }
    });
  });
}
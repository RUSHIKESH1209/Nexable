import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import messageRouter from './routes/messageroute.js';
import postRouter from './routes/postRouter.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});
 
await connectDB();


app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/message', messageRouter);

app.get('/', (req, res) => res.send('Hello'));

const users = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('register', (userId) => {
    users[userId] = socket.id;
  });

  socket.on('send_message', ({ sender, receiver, message }) => {
    const receiverSocketId = users[receiver];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', { sender, message });
    }
  });

  socket.on('typing', ({ to }) => {
    const receiverSocketId = users[to];
    if (receiverSocketId) io.to(receiverSocketId).emit('typing');
  });

  socket.on('seen', ({ from }) => {
    const senderSocketId = users[from];
    if (senderSocketId) io.to(senderSocketId).emit('seen');
  });

  socket.on('disconnect', () => {
    for (const userId in users) {
      if (users[userId] === socket.id) delete users[userId];
    }
  });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));



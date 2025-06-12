import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import messageRouter from './routes/messageroute.js';
import postRouter from './routes/postRouter.js';
import notificationRouter from './routes/notificationRouter.js';

import initializeSocket from './socket.js';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO functionality
initializeSocket(server);

await connectDB();
connectCloudinary();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/message', messageRouter);
app.use('/api/notification', notificationRouter);

app.get('/', (req, res) => res.send('Hello'));

server.listen(3000, () => console.log('Server running on http://localhost:3000'));

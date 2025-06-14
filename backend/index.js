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

initializeSocket(server);

await connectDB();
connectCloudinary();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/message', messageRouter);
app.use('/api/notification', notificationRouter);

app.get('/ping', (req, res) => {
    console.log('Received keep-alive ping at:', new Date().toISOString());
    res.status(200).send('Pong! Backend is alive.');
});


app.get('/', (req, res) => res.send('Hello'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

import express from "express";
import authUser from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { getNotifications, markAsRead } from '../controllers/notificationController.js';

const notificationRouter = express.Router();

notificationRouter.get('/', authUser, getNotifications);
notificationRouter.put('/read/:id', authUser, markAsRead);

export default notificationRouter;
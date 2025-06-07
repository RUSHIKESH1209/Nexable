import express from 'express';
import authUser from '../middleware/auth.js';
import { sendMessage, getMessages, markMessagesSeen } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', authUser, sendMessage);
router.get('/:receiverId', authUser, getMessages);
router.patch('/seen/:senderId', authUser, markMessagesSeen);

export default router;

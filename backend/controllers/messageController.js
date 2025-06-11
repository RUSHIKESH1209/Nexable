import Message from '../models/messagemodel.js';
import notificationModel from '../models/notificationModel.js';

export const sendMessage = async (req, res) => {
  try {
    const sender = req.user.id;
    const { receiver, message } = req.body;

    const newMsg = await Message.create({ sender, receiver, message });

    // Avoid notifying yourself
    if (receiver !== sender) {
      await notificationModel.create({
        recipient: receiver,
        sender,
        type: 'message',
        text: message,
      });
    }

    res.status(201).json(newMsg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};


export const getMessages = async (req, res) => {
  try {
    const sender = req.user.id;
    const { receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender, receiver: receiverId },
        { sender: receiverId, receiver: sender }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const markMessagesSeen = async (req, res) => {
  try {
    const receiver = req.user.id;
    const sender = req.params.senderId;

    await Message.updateMany({ sender, receiver, seen: false }, { seen: true });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark messages as seen' });
  }
};

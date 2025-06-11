import notificationModel from '../models/notificationModel.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await notificationModel
      .find({ recipient: userId })
      .sort({ createdAt: -1 })
      
    res.json({ success: true, notifications });
    console.log('Notifications fetched successfully' + notifications);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await notificationModel.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating notification' });
  }
};

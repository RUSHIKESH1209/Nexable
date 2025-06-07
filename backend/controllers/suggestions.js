import User from '../models/userModel.js';

// Get all users except the logged-in one
export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Based on your middleware

    const users = await User.find({ _id: { $ne: currentUserId } })
     

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

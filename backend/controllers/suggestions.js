import User from '../models/userModel.js';
import mongoose from 'mongoose';

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




export const suggestUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const suggestionLimit = 10
    const connections = currentUser.connections || [];
    const alreadySuggested = new Set([...connections, userId]);
    let suggestions = [];

    // 1. Mutual connections
    const mutuals = await User.find({
      _id: { $nin: Array.from(alreadySuggested) },
      connections: { $in: connections },
    });

    for (const user of mutuals) {
      if (suggestions.length >= suggestionLimit) break;
      if (!alreadySuggested.has(user._id.toString())) {
        alreadySuggested.add(user._id.toString());
        suggestions.push(user);
      }
    }

    // 2. Address or Company matches
    const matchAddressCompany = await User.find({
      _id: { $nin: Array.from(alreadySuggested) },
      $or: [
        { address: currentUser.address },
        { company: currentUser.company }
      ]
    });

    for (const user of matchAddressCompany) {
      if (suggestions.length >= suggestionLimit) break;
      if (!alreadySuggested.has(user._id.toString())) {
        alreadySuggested.add(user._id.toString());
        suggestions.push(user);
      }
    }

    // 3. Fill remaining with random users (loop until we hit the limit)
    while (suggestions.length < suggestionLimit) {
      const needed = suggestionLimit - suggestions.length;
      const randomUsers = await User.aggregate([
        {
          $match: {
            _id: {
              $nin: Array.from(alreadySuggested).map(id => new mongoose.Types.ObjectId(id))
            }
          }
        },
        { $sample: { size: needed } }
      ]);

      if (randomUsers.length === 0) break;

      for (const user of randomUsers) {
        if (suggestions.length >= suggestionLimit) break;
        alreadySuggested.add(user._id.toString());
        suggestions.push(user);
      }
    }

    res.json(suggestions);
  } catch (err) {
    console.error('Suggest Users Error:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
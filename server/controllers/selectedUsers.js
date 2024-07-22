const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');

router.get('/', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const loggedInUserId = req.user._id;

    const user = await User.findById(loggedInUserId).populate('selectedUsers');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const selectedUsersWithLastMessage = await Promise.all(
      user.selectedUsers.map(async (selectedUser) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: loggedInUserId, recipient: selectedUser._id },
            { sender: selectedUser._id, recipient: loggedInUserId }
          ]
        }).sort({ timestamp: -1 });

        return {
          ...selectedUser.toObject(),
          lastMessage: lastMessage ? lastMessage.content : 'No messages yet',
          lastMessageTimestamp: lastMessage ? lastMessage.timestamp : null
        };
      })
    );

    selectedUsersWithLastMessage.sort((a, b) => {
      if (!a.lastMessageTimestamp) return 1;
      if (!b.lastMessageTimestamp) return -1;
      return b.lastMessageTimestamp - a.lastMessageTimestamp;
    });

    res.json({ selectedUsers: selectedUsersWithLastMessage });
  } catch (err) {
    console.error('Error fetching selected users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

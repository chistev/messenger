const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  const { username } = req.query;
  const currentUserUsername = req.user.username;

  try {
    const currentUser = await User.findOne({ username: currentUserUsername });

    if (!currentUser) {
      return res.status(404).send('Current user not found');
    }

    const selectedUserIds = currentUser.selectedUsers.map(user => user._id);
    console.log('Selected users to exclude:', selectedUserIds);
    const users = await User.find({
      username: new RegExp(username, 'i'),
      username: { $ne: currentUserUsername },
      _id: { $nin: selectedUserIds }
    }).limit(10);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

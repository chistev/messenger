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

    // Fetch the details of the excluded users
    const selectedUsers = await User.find({ _id: { $in: currentUser.selectedUsers } }, 'username');

    const selectedUserIds = currentUser.selectedUsers.map(user => user._id);
    const selectedUsernames = selectedUsers.map(user => user.username);

    console.log('Current user username:', currentUserUsername);
    console.log('Selected users to exclude (IDs):', selectedUserIds);
    console.log('Selected users to exclude (Usernames):', selectedUsernames);

    const users = await User.find({
      username: new RegExp(username, 'i'),
      _id: { $nin: selectedUserIds.concat(currentUser._id) }
    }).limit(10);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  const { username } = req.query;
  const currentUserUsername = req.user.username;

  // Log request details including headers
  console.log('Request received:', {
    headers: req.headers,
    query: req.query,
    currentUserUsername,
    user: req.user
  });

  try {
    // Find the current user based on their username
    const currentUser = await User.findOne({ username: currentUserUsername });

    console.log('Current user found:', currentUser);

    if (!currentUser) {
      console.log('Current user not found');
      return res.status(404).send('Current user not found');
    }

    // Find selected users based on IDs in the current user's selectedUsers array
    const selectedUsers = await User.find({ _id: { $in: currentUser.selectedUsers } }, 'username');

    console.log('Selected users found:', selectedUsers);

    const selectedUserIds = currentUser.selectedUsers.map(user => user._id);
    const selectedUsernames = selectedUsers.map(user => user.username);

    console.log('Selected user IDs:', selectedUserIds);
    console.log('Selected usernames:', selectedUsernames);

    // Find users matching the query username, excluding selected users and current user
    const users = await User.find({
      username: new RegExp(username, 'i'),
      _id: { $nin: selectedUserIds.concat(currentUser._id) }
    }).limit(10);

    console.log('Users matching query:', users);

    res.json(users);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

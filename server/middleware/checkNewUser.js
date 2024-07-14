// checkNewUser.js

const User = require('../models/User');

const checkNewUser = async (req, res, next) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const existingUser = await User.findOne({ googleId: req.user.googleId });
    if (existingUser && existingUser.username) {
      // User already exists with a username
      return res.json({ exists: true });
    } else {
      // User is new and needs to select a username
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = checkNewUser;

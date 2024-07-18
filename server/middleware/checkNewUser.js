const User = require('../models/User');

const checkNewUser = async (req, res, next) => {
  try {
    if (req.isAuthenticated() || req.user) {
      return res.status(401).json({ error: 'User already authenticated' });
    }

    const existingUser = await User.findOne({ googleId: req.user.googleId });
    if (existingUser && existingUser.username) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = checkNewUser;
 
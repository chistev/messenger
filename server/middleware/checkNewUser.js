const User = require('../models/User');

const checkNewUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const existingUser = await User.findOne({ googleId: req.user.googleId });

    if (existingUser) {
      if (existingUser.username) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = checkNewUser;

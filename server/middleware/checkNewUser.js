const User = require('../models/User');

const checkNewUser = async (req, res, next) => {
  try {
    console.log('checkNewUser middleware called');
    console.log('Request received:', {
      headers: req.headers,
      body: req.body,
      user: req.user
    });
    
    if (!req.user || !req.user._id) {
      console.log('Unauthorized: No user or user ID found');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('Checking existing user with Google ID:', req.user.googleId);
    const existingUser = await User.findOne({ googleId: req.user.googleId });

    if (existingUser) {
      console.log('Existing user found:', existingUser);
      if (existingUser.username) {
        console.log('User has a username');
        return res.json({ exists: true });
      } else {
        console.log('User does not have a username');
        return res.json({ exists: false });
      }
    } else {
      console.log('No existing user found');
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = checkNewUser;

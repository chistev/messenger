const dotenv = require('dotenv');
dotenv.config();

const checkNewUser = async (req, res, next) => {
  try {
    console.log('checkNewUser middleware called');
    console.log('Request received:', {
      headers: req.headers,
      body: req.body,
      user: req.user,
      tempUser: req.tempUser
    });

    // Check if JWT token is present
    if (!req.user && !req.tempUser) {
      console.log('Unauthorized: No user or temporary user found');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // If the token is for a fully registered user
    if (req.user) {
      console.log('Token belongs to a fully registered user:', req.user);
      return res.json({ exists: true });
    }

    // If the token is for a temporary user
    if (req.tempUser) {
      console.log('Token belongs to a temporary user:', req.tempUser);
      return res.json({ exists: false });
    }

    // If the token is invalid or does not match any user
    console.log('Invalid token or user not found');
    return res.status(401).json({ error: 'Unauthorized' });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = checkNewUser;

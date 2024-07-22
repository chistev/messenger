const dotenv = require('dotenv');
dotenv.config();

const checkNewUser = async (req, res, next) => {
  try {
    // Check if JWT token is present
    if (!req.user && !req.tempUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // If the token is for a fully registered user
    if (req.user) {
      return res.json({ exists: true });
    }

    // If the token is for a temporary user
    if (req.tempUser) {
      return res.json({ exists: false });
    }

    return res.status(401).json({ error: 'Unauthorized' });
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = checkNewUser;

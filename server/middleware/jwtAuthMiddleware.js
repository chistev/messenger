const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] || req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    if (decoded.id) {
      // Fully registered user
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
        return next();
      } else {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
      }
    } else if (decoded.googleId) {
      // Temporary user
      req.tempUser = decoded;
      return next();
    } else {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;

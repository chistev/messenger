const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] || req.cookies.jwt;
  console.log('Token received:', token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log('Token decoded:', decoded);

    if (decoded.id) {
      // Fully registered user
      console.log('Token belongs to a fully registered user, user ID:', decoded.id);
      const user = await User.findById(decoded.id);
      if (user) {
        console.log('User found:', user);
        req.user = user;
        return next();
      } else {
        console.log('User not found in the database');
        return res.status(401).json({ message: 'Unauthorized: User not found' });
      }
    } else if (decoded.googleId) {
      // Temporary user
      console.log('Token belongs to a temporary user, Google ID:', decoded.googleId);
      req.tempUser = decoded;
      return next();
    } else {
      console.log('Invalid token');
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;

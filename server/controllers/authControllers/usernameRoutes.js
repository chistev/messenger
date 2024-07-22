const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const verifyToken = require('../../middleware/jwtAuthMiddleware');
const jwt = require('jsonwebtoken');

router.get('/check-username', async (req, res) => {
    const { username } = req.query;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.json({ available: false });
        } else {
            res.json({ available: true });
        }
    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/select-username', verifyToken, async (req, res) => {
    const tempUser = req.tempUser;
  
    if (!tempUser) {
      return res.redirect('https://svelte-of1p.onrender.com/signin');
    }
  
    const { username } = req.body;
  
    let errors = [];
    if (username.length < 5) {
      errors.push('Your username must be at least 5 characters long.');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Your username can only contain letters, numbers, and \'_\'.');
    }
  
    const existingUser = await User.findOne({ googleId: tempUser.googleId });
    if (existingUser && existingUser.username) {
      errors.push('You have already created a username.');
    }
  
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(' ') });
    }
  
    const newUser = new User({
      googleId: tempUser.googleId,
      email: tempUser.email,
      username
    });
  
    try {
      await newUser.save();
      
      // Create a new token for the fully registered user
      const newToken = jwt.sign({ id: newUser._id }, process.env.SECRET, { expiresIn: '1d' });
  
      res.json({ success: true, token: newToken });
    } catch (error) {
      console.error('Error creating new user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;

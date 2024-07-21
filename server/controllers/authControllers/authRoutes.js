const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }), // Do not use sessions
  (req, res) => {
    if (req.user) {
      const token = req.user.token;

      // Set a cookie with the token
      res.cookie('jwt', token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: process.env.NODE_ENV === 'production', // True in production
        httpOnly: true, // Prevent access from JavaScript
        sameSite: 'None' // Allow cross-site cookies
      });

      // Redirect based on user status
      if (req.user.user) {
        res.redirect('https://svelte-of1p.onrender.com/messages');
      } else if (req.user.tempUser) {
        res.redirect('https://svelte-of1p.onrender.com/select');
      }
    } else {
      res.redirect('https://svelte-of1p.onrender.com/signin');
    }
  }
);

module.exports = router;

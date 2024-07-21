const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }), // Do not use sessions
  (req, res) => {
    if (req.user) {
      // If token and user are present, decide where to redirect
      if (req.user.user) {
        // User exists in database
        res.redirect('https://svelte-of1p.onrender.com/messages');
      } else if (req.user.tempUser) {
        // Temporary user
        res.redirect('https://svelte-of1p.onrender.com/select');
      }
    } else {
      res.redirect('https://svelte-of1p.onrender.com/signin');
    }
  }
);

module.exports = router;

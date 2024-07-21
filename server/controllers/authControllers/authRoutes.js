const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/auth/google', (req, res, next) => {
  console.log('Initiating Google authentication');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false }), // Do not use sessions
  (req, res) => {
    console.log('Google authentication callback');

    if (req.user) {
      console.log('User authenticated:', req.user);
      const token = req.user.token;

      // Set a cookie with the token
      console.log('Setting JWT cookie');
      res.cookie('jwt', token, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: process.env.NODE_ENV === 'production', // True in production
        httpOnly: false, // allow access from JavaScript
        sameSite: 'None', // Allow cross-site cookies
        domain: 'svelte-of1p.onrender.com', // Client domain
        path: '/' // Ensure the cookie is accessible from the entire domain
      });

      // Redirect based on user status
      if (req.user.user) {
        console.log('Fully registered user, redirecting to messages');
        res.redirect('https://svelte-of1p.onrender.com/messages');
      } else if (req.user.tempUser) {
        console.log('Temporary user, redirecting to select page');
        res.redirect('https://svelte-of1p.onrender.com/select');
      }
    } else {
      console.log('User not authenticated, redirecting to sign-in page');
      res.redirect('https://svelte-of1p.onrender.com/signin');
    }
  }
);

module.exports = router;

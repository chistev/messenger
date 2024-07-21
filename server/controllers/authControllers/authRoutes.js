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
      const redirectUrl = req.user.user ? 'https://svelte-of1p.onrender.com/messages' : 'https://svelte-of1p.onrender.com/select';

      // Redirect with token and redirect URL as query parameters
      res.redirect(`https://svelte-of1p.onrender.com/auth?token=${token}&redirectUrl=${redirectUrl}`);
    } else {
      console.log('User not authenticated, redirecting to sign-in page');
      res.redirect('https://svelte-of1p.onrender.com/signin');
    }
  }
);

module.exports = router;

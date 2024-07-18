const express = require('express');
const passport = require('passport');
const router = express.Router();

// Authentication routes
router.get('/logout', (req, res) => {
  res.render('auth/logout', { title: 'Logout', body: '' });
});

router.get('/signin', (req, res) => {
  res.render('auth/signin', { title: 'Signin', body: '' });
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'https://svelte-of1p.onrender.com/signin' }),
  (req, res) => {
    if (req.user) {
      // Manually set the cookie
      res.cookie('connect.sid', req.sessionID, {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: process.env.NODE_ENV === 'production', // True in production
        httpOnly: false, // Allow client-side access
        sameSite: 'None' // Allow cross-site cookies
      });

      // Check if the user exists based on API response
      fetch('https://messenger-tu85.onrender.com/api/check-new-user', {
        credentials: 'include'
      })
        .then(response => response.json())
        .then(data => {
          if (data.exists) {
            res.redirect('https://svelte-of1p.onrender.com/messages');
          } else {
            res.redirect('https://svelte-of1p.onrender.com/select');
          }
        })
        .catch(error => {
          console.error('Error checking new user:', error);
          res.redirect('https://svelte-of1p.onrender.com/signin');
        });

    } else {
      res.redirect('https://svelte-of1p.onrender.com/signin');
    }
  }
);

module.exports = router;

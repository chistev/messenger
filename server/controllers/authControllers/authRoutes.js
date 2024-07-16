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
      if (req.user.username) {
        res.redirect('https://svelte-of1p.onrender.com');
      } else {
        res.redirect('https://svelte-of1p.onrender.com/select');
      }
    } else {
      res.redirect('https://svelte-of1p.onrender.com/signin');
    }
  }
);

module.exports = router;

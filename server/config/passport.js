const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id })
        .then(existingUser => {
          if (existingUser) {
            return done(null, existingUser);
          } else {
            const tempUser = {
              googleId: profile.id,
              email: profile.emails[0].value
            };
            return done(null, tempUser);
          }
        })
        .catch(err => {
          console.error('Error finding user:', err);
          return done(err);
        });
    }
  ));

  passport.serializeUser((user, done) => {
    if (user._id) {
      done(null, user._id);
    } else {
      done(null, user);
    }
  });

  passport.deserializeUser((id, done) => {
    if (typeof id === 'object' && id.googleId) {
      done(null, id);
    } else {
      User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
    }
  });
};

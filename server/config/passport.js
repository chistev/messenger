const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://messenger-tu85.onrender.com/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Google profile:', profile);

      User.findOne({ googleId: profile.id })
        .then(existingUser => {
          if (existingUser) {
            console.log('Existing user found:', existingUser);
            return done(null, existingUser);
          } else {
            const tempUser = {
              googleId: profile.id,
              email: profile.emails[0].value
            };
            console.log('Creating new temp user:', tempUser);
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
    console.log('Serialize user:', user);
    if (user._id) {
      done(null, user._id);
    } else {
      done(null, user);
    }
  });

  passport.deserializeUser((id, done) => {
    console.log('Deserialize user id:', id);
    if (typeof id === 'object' && id.googleId) {
      done(null, id);
    } else {
      User.findById(id)
        .then(user => {
          console.log('Deserialized user:', user);
          done(null, user);
        })
        .catch(err => {
          console.error('Error fetching user:', err);
          done(err);
        });
    }
  });
};

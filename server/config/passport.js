const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function initializePassport(passport) {
  // JWT Strategy
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET,
  }, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      console.error('JWT Strategy - Error:', err);
      return done(err, false);
    }
  }));

  // Google Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://messenger-tu85.onrender.com/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the user already exists in the database
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // User exists, generate a token and return the existing user
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET, { expiresIn: '1d' });
        done(null, { user: existingUser, token });
      } else {
        // User does not exist, create a temporary user and return a token
        const tempUser = {
          googleId: profile.id,
          email: profile.emails[0].value,
        };

        const token = jwt.sign({ googleId: tempUser.googleId, email: tempUser.email }, process.env.SECRET, { expiresIn: '1d' });
        done(null, { tempUser, token });
      }
    } catch (err) {
      console.error('Google Strategy - Error:', err);
      done(err);
    }
  }));
}

module.exports = initializePassport;

const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = (passport) => {
  return session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions'
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      httpOnly: false,
      sameSite: 'none' // Adjust based on your cross-origin requirements
    }
  });
};

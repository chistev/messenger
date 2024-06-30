const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const { createServer } = require('http');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/mongoose');
connectDB();

// Initialize Passport
const initializePassport = require('./config/passport');
initializePassport(passport);
const server = createServer(app);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure express-session middleware
app.use(session({
  secret: process.env.SECRET, 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day in milliseconds
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require('./controllers/authControllers/authRoutes');
const usernameRoutes = require('./controllers/authControllers/usernameRoutes');

app.use('/', authRoutes);
app.use('/', usernameRoutes);

// Serve static files from the 'client/public' folder (where Svelte outputs files)
app.use(express.static(path.join(__dirname, '../client/static')));

// Serve the Svelte application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/src', 'app.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

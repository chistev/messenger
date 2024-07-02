const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const { createServer } = require('http');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const clientport = 5173
const User = require('./models/User');

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
app.get('/', (req, res) => {
  res.redirect(`http://localhost:${clientport}/`);
});

const authRoutes = require('./controllers/authControllers/authRoutes');
const usernameRoutes = require('./controllers/authControllers/usernameRoutes');

app.use('/', authRoutes);
app.use('/', usernameRoutes);


// Serve static files from the 'client/public' folder (where Svelte outputs files)
app.use(express.static(path.join(__dirname, '../client/static')));

// Serve the Svelte application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/src'));
});

app.get('/api/users', async (req, res) => {
  const { username } = req.query;
  const currentUserUsername = req.user.username; 

   try {
    // Fetch the current user to get the selectedUsers array
    const currentUser = await User.findOne({ username: currentUserUsername });

    if (!currentUser) {
      return res.status(404).send('Current user not found');
    }

    const selectedUserIds = currentUser.selectedUsers.map(user => user._id);
    console.log('Selected users to exclude:', selectedUserIds);

    // Find users matching the query but exclude the current user and selected users
    const users = await User.find({ 
      username: new RegExp(username, 'i'), 
      username: { $ne: currentUserUsername }, // Exclude the current user's username
      _id: { $nin: selectedUserIds } // Exclude already selected users
    }).limit(10);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

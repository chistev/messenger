const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 3000;
const { createServer } = require('http');
const dotenv = require('dotenv');
const passport = require('passport');
const User = require('./models/User');
const selectUser = require('./controllers/selectUser');
const checkNewUser = require('./middleware/checkNewUser');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/mongoose');
connectDB();

// Session configuration
app.use(session({
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
}));


// Initialize Passport
const initializePassport = require('./config/passport');
initializePassport(passport);

// Create HTTP server
const server = createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket handling
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Parsed message:', parsedMessage);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }

    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize()); // Passport initialization
app.use(passport.session()); // Passport session setup

// CORS setup
app.use(cors({
  origin: 'https://svelte-of1p.onrender.com',
  credentials: true
}));

// Routes setup
app.use('/', require('./controllers/authControllers/authRoutes'));
app.use('/', require('./controllers/authControllers/usernameRoutes'));
app.use('/api/users', require('./controllers/users'));
app.use('/api/messages', require('./controllers/messageController'));
app.use('/api/select-user', selectUser.selectUser);
app.use('/api/selected-users', require('./controllers/selectedUsers'));
app.use('/api/check-new-user', checkNewUser);

// Endpoint to retrieve user by ID
app.get('/api/users/:userid', async (req, res) => {
  try {
    const user = await User.findById(req.params.userid);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

// Endpoint to retrieve logged-in user ID
app.get('/api/loggedInUserId', async (req, res) => {
  console.log('Session:', req.session);
  console.log('User:', req.user);
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error('User not found');
    }
    res.json({ loggedInUserId: user._id });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Endpoint to handle logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Assuming 'connect.sid' is your session cookie name
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

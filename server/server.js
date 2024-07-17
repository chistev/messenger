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
const session = require('./middleware/session');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
const connectDB = require('./config/mongoose');
connectDB();

// Initialize Passport
const initializePassport = require('./config/passport');
initializePassport(passport);
const server = createServer(app);
const wss = new WebSocket.Server({ server });

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

app.use(cors({
  origin: 'https://svelte-of1p.onrender.com',
  credentials: true
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('./middleware/session')(passport));
// Passport configuration
app.use(passport.initialize());
app.use(passport.session());


// Logging middleware for session
app.use((req, res, next) => {
  console.log('Session Middleware:', req.session);
  next();
});


// Routes
app.use('/', require('./controllers/authControllers/authRoutes'));
app.use('/', require('./controllers/authControllers/usernameRoutes'));
app.use('/api/users', require('./controllers/users'));
app.use('/api/messages', require('./controllers/messageController'));
app.use('/api/select-user', selectUser.selectUser);
app.use('/api/selected-users', require('./controllers/selectedUsers'));
app.use('/api/check-new-user', checkNewUser);

// Example route handler in Express.js
app.get('/api/loggedInUserId', async (req, res) => {
  try {
    // Log the incoming request headers
    console.log('Request Headers:', req.headers);

    // Check if the 'connect.sid' cookie is present
    const cookie = req.headers.cookie;
    if (cookie && cookie.includes('connect.sid')) {
      console.log('connect.sid cookie found in request.');
    } else {
      console.log('connect.sid cookie not found in request.');
    }

    // Your logic to handle the request
    // Retrieve logged in user ID from session or database
    const loggedInUserId = req.user._id; // Assuming req.user is set correctly by passport

    if (!loggedInUserId) {
      throw new Error('User ID not found'); // Example error handling
    }

    // Respond with the logged in user ID
    res.json({ loggedInUserId });
  } catch (error) {
    console.error('Error fetching logged in user ID:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Logout route
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid'); // Assuming 'connect.sid' is your session cookie name
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

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


// Middleware to deserialize the user from the session
function deserializeUser(req, res, next) {
  try {
    const cookie = req.headers.cookie;
    if (!cookie || !cookie.includes('connect.sid')) {
      console.error('connect.sid cookie not found in request.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sessionID = cookie.split('connect.sid=')[1].split(';')[0].trim();

    req.sessionStore.get(sessionID, (err, session) => {
      if (err || !session) {
        console.error('Error retrieving session:', err);
        return res.status(500).json({ error: 'Session retrieval failed' });
      }

      if (!session.passport || !session.passport.user) {
        console.error('No user data in session.');
        return res.status(401).json({ error: 'Unauthorized' });
      }

      req.user = { _id: session.passport.user }; 

      next();
    });
  } catch (error) {
    console.error('Error in deserializing user:', error);
    res.status(500).json({ error: 'Server Error' });
  }
}

// Apply middleware to all routes that need authentication
app.use('/api', deserializeUser);

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

app.get('/api/loggedInUserId', (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    if (!loggedInUserId) {
      console.error('User ID not found.');
      throw new Error('User ID not found');
    }

    console.log('Logged in user ID:', loggedInUserId);

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
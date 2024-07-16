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
    // Attempt to parse the received message
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Parsed message:', parsedMessage);
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }

    // Broadcast message to all connected clients
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

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('./middleware/session')(passport));

app.use(cors({
  origin: 'https://svelte-of1p.onrender.com',
  credentials: true
}));

app.use(session(passport)); // session middleware is used before passport initialization

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./controllers/authControllers/authRoutes'));
app.use('/', require('./controllers/authControllers/usernameRoutes'));
app.use('/api/users', require('./controllers/users'));
app.use('/api/messages', require('./controllers/messageController'));
app.use('/api/select-user', selectUser.selectUser);
app.use('/api/selected-users', require('./controllers/selectedUsers'));
app.use('/api/check-new-user', checkNewUser);


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

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // Assuming 'connect.sid' is your session cookie name
      return res.status(200).json({ message: 'Logged out successfully' });
  });
});
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

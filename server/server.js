const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const app = express();
const port = 3000;
const { createServer } = require('http');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const clientport = 5173;
const User = require('./models/User');
const Message = require('./models/Message');
const selectUser = require('./controllers/selectUser');

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
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);

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
        console.log(`Sent message => ${message}`);
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

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.redirect(`http://localhost:${clientport}/`);
});

app.use('/', require('./controllers/authControllers/authRoutes'));
app.use('/', require('./controllers/authControllers/usernameRoutes'));
app.use('/api/users', require('./controllers/users'));
app.use('/api/messages', require('./controllers/messageController'));
app.use('/api/select-user', selectUser.selectUser);
app.use('/api/selected-users', require('./controllers/selectedUsers'));


// Serve static files from the 'client/public' folder (where Svelte outputs files)
app.use(express.static(path.join(__dirname, '../client/static')));

// Serve the Svelte application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/src'));
});

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
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error('User not found');
    }
    console.log(user + "this is the user");
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

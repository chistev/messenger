const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 3000;
const { createServer } = require('http');
const dotenv = require('dotenv');
const passport = require('passport');
const selectUser = require('./controllers/selectUser');
const checkNewUser = require('./middleware/checkNewUser');
const cors = require('cors');
const verifyToken = require('./middleware/jwtAuthMiddleware');
const cookieParser = require('cookie-parser');

dotenv.config();

const connectDB = require('./config/mongoose');
connectDB();

const initializePassport = require('./config/passport');
initializePassport(passport);

const server = createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  let userId;

  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Parsed message:', parsedMessage);

      if (parsedMessage.action === 'identify') {
        userId = parsedMessage.userId;
        ws.userId = userId; // Attach userId to WebSocket
      } else {
        // Broadcast message to the intended recipient
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            // Ensure that the message is sent only to the intended recipient
            if (client.userId === parsedMessage.recipient || client.userId === parsedMessage.sender ) {
              client.send(message);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

// Middleware to make WebSocket server accessible in routes
app.use((req, res, next) => {
  req.wss = wss;
  next();
});

// Use JWT verification middleware for API routes
app.use('/api', verifyToken);

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
    res.json({ loggedInUserId });
  } catch (error) {
    console.error('Error fetching logged in user ID:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

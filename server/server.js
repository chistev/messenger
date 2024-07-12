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

// Serve static files from the 'client/public' folder (where Svelte outputs files)
app.use(express.static(path.join(__dirname, '../client/static')));

// Serve the Svelte application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/src'));
});

app.post('/api/select-user', async (req, res) => {
  const { selectedUserId } = req.body;
  const currentUser = req.user;

  if (!currentUser) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const user = await User.findById(currentUser._id);
    if (!user) {
      console.log(`User ${currentUser._id} not found`);
      return res.status(404).send('User not found');
    }

    console.log(`Attempting to update user ${currentUser._id} to add selected user ${selectedUserId}`);
    await User.findByIdAndUpdate(currentUser._id, { $addToSet: { selectedUsers: selectedUserId } });
    
    const updatedUser = await User.findById(currentUser._id);
    if (updatedUser) {
      console.log(`Updated selected users for user ${currentUser._id}:`, updatedUser.selectedUsers);
    }

    console.log(`Successfully updated user ${currentUser._id} with selected user ${selectedUserId}`);
    res.status(200).json({ message: 'Selected user updated' });
  } catch (error) {
    console.error(`Error updating user ${currentUser._id} with selected user ${selectedUserId}:`, error);
    res.status(500).send('Server Error');
  }
});

// Route to fetch selected users with last message content and timestamp
app.get('/api/selected-users', async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Assuming user is authenticated and user ID is available
    console.log(`Fetching selected users for logged in user ID: ${loggedInUserId}`);

    // Fetch the logged-in user and populate selectedUsers
    const user = await User.findById(loggedInUserId).populate('selectedUsers');
    if (!user) {
      console.log(`User not found with ID: ${loggedInUserId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch last message content and timestamp for each selected user
    const selectedUsersWithLastMessage = await Promise.all(
      user.selectedUsers.map(async (selectedUser) => {
        const lastMessage = await Message.findOne({
          $or: [
            { sender: loggedInUserId, recipient: selectedUser._id },
            { sender: selectedUser._id, recipient: loggedInUserId }
          ]
        }).sort({ timestamp: -1 });

        console.log(`Selected user: ${selectedUser._id}, Last message: ${lastMessage ? lastMessage.content : 'No message found'}`);

        return {
          ...selectedUser.toObject(),
          lastMessage: lastMessage ? lastMessage.content : 'No messages yet',
          lastMessageTimestamp: lastMessage ? lastMessage.timestamp : null
        };
      })
    );

    // Sort selected users by lastMessageTimestamp in descending order
    selectedUsersWithLastMessage.sort((a, b) => {
      if (!a.lastMessageTimestamp) return 1; // Move users with no messages to the end
      if (!b.lastMessageTimestamp) return -1; // Move users with no messages to the end
      return b.lastMessageTimestamp - a.lastMessageTimestamp;
    });

    console.log('Selected users with last message:', selectedUsersWithLastMessage);

    res.json({ selectedUsers: selectedUsersWithLastMessage });
  } catch (err) {
    console.error('Error fetching selected users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/:userid', async (req, res) => {
  console.log("route hit")
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

app.post('/api/messages/:userId', async (req, res) => {
  const { userId } = req.params;
  const { content, type } = req.body;

  const message = new Message({
    content,
    type,
    sender: req.user._id,
    recipient: userId
  });

  try {
    const savedMessage = await message.save();
    console.log(`Message saved - Sender: ${req.user._id}, Recipient: ${userId}, Timestamp: ${savedMessage.timestamp}`);
    
    // Broadcast the saved message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(savedMessage));
      }
    });

    res.status(200).json(savedMessage);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.get('/api/messages/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({ $or: [{ sender: userId }, { recipient: userId }] })
                                  .sort({ timestamp: 1 });
    console.log(`Messages fetched for User ID: ${userId}`, messages);
    res.status(200).json({ messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
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

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Route to post a message
router.post('/:userId', async (req, res) => {
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
    req.wss.clients.forEach((client) => {
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

// Route to get messages for a user
router.get('/:userId', async (req, res) => {
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

module.exports = router;

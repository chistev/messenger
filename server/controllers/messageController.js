const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

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

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({ $or: [{ sender: userId }, { recipient: userId }] })
                                  .sort({ timestamp: 1 });
    res.status(200).json({ messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;

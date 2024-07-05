const mongoose = require('mongoose');

// Define the Message schema
const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['sent', 'received'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Create a model based on the schema
const Message = mongoose.model('Message', MessageSchema);

// Export the model
module.exports = Message;

const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path if needed
const Message = require('./models/Message'); // Adjust the path if needed

// Replace with your MongoDB URI
const mongoURI = '';

async function clearDatabase() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clear User collection
    await User.deleteMany({});
    console.log('User collection cleared');

    // Clear Message collection
    await Message.deleteMany({});
    console.log('Message collection cleared');

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error clearing the database:', err);
  }
}

clearDatabase();

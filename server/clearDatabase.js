const mongoose = require('mongoose');
const User = require('./models/User'); 
const Message = require('./models/Message'); 
const dotenv = require('dotenv');

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

async function clearDatabase() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('User collection cleared');

    await Message.deleteMany({});
    console.log('Message collection cleared');

    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error clearing the database:', err);
  }
}

clearDatabase();

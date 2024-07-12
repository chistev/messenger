const User = require('../models/User');

const selectUser = async (req, res) => {
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
};

module.exports = {
  selectUser,
};

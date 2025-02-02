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
      return res.status(404).send('User not found');
    }

    await User.findByIdAndUpdate(currentUser._id, { $addToSet: { selectedUsers: selectedUserId } });

    const updatedUser = await User.findById(currentUser._id).populate('selectedUsers'); // Populate selectedUsers with full user data
    if (updatedUser) {
      console.log(`Updated selected users for user ${currentUser._id}:`, updatedUser.selectedUsers);
    }

    const selectedUser = updatedUser.selectedUsers.find(user => user._id.toString() === selectedUserId);

    res.status(200).json({ selectedUser });
  } catch (error) {
    console.error(`Error updating user ${currentUser._id} with selected user ${selectedUserId}:`, error);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  selectUser,
};

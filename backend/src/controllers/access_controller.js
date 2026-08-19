import User from '../models/User.js';

// Get all users and all active authorized cards for NVS sync
 const getAccessOverview = async (req, res) => {
  try {
    const users = await User.find().select('name role cardUID');
    const authorizedCards = users
      .map((u) => u.cardUID)
      .filter((card) => card !== null);

    return res.status(200).json({
      success: true,
      users,
      authorizedCards,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Assign a card to a user & emit NVS command to ESP32
 const assignCard = async (req, res) => {
  try {
    const { userId, cardUID } = req.body;

    if (!userId || !cardUID) {
      return res.status(400).json({
        success: false,
        message: 'Both userId and cardUID are required.',
      });
    }

    const formattedUID = cardUID.trim().toUpperCase();

    // Check if card is already assigned to another user
    const existingCardUser = await User.findOne({ cardUID: formattedUID });
    if (existingCardUser && existingCardUser._id.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: `Card ${formattedUID} is already assigned to ${existingCardUser.name}`,
      });
    }

    // Update user record
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cardUID: formattedUID },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Access Socket.io instance attached to express app
    const io = req.app.get('io');
    if (io) {
      // Command ESP32 to write UID to NVS RAM/Flash
      io.emit('nvs_command', {
        action: 'ADD_CARD',
        cardUID: formattedUID,
      });

      // Broadcast update to all connected dashboard clients
      io.emit('access_updated', {
        userId: updatedUser._id,
        user: updatedUser,
        action: 'ASSIGNED',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Card ${formattedUID} assigned to ${updatedUser.name}`,
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Revoke card from user & emit NVS delete command
 const revokeCard = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const targetUID = user.cardUID;
    user.cardUID = null;
    await user.save();

    const io = req.app.get('io');
    if (io && targetUID) {
      // Command ESP32 to remove UID from NVS RAM/Flash
      io.emit('nvs_command', {
        action: 'DELETE_CARD',
        cardUID: targetUID,
      });

      // Broadcast update to dashboards
      io.emit('access_updated', {
        userId: user._id,
        user,
        action: 'REVOKED',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Access revoked for ${user.name}`,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
    getAccessOverview,
assignCard,
revokeCard
}
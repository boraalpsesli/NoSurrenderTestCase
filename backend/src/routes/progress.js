const express = require('express');
const router = express.Router();
const UserItem = require('../models/UserItem');
const User = require('../models/User');

router.post('/', async (req, res) => {
  const { userId, itemId } = req.body;
  if (!userId || !itemId) return res.status(400).json({ error: 'userId and itemId required' });

  try {
      const userItem = await UserItem.findOne({ userId, itemId });
    if (!userItem) return res.status(404).json({ error: 'UserItem not found' });
    
    userItem.progress += 2;
   
    await userItem.save();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.energy -= 1;
    await user.save();

    res.json({ progress: userItem.progress, energy: user.energy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
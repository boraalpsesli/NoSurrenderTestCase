const express = require('express');
const UserItem = require('../models/UserItem');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, itemId } = req.body;
  if (!userId || !itemId) return res.status(400).json({ error: 'userId and itemId required' });

  try {
    const userItem = await UserItem.findOne({ userId, itemId }).populate('itemId');
    if (!userItem) return res.status(404).json({ error: 'UserItem not found' });
    
    userItem.level += 1;
    userItem.progress = 0;
    await userItem.save();

    const currentItem = userItem.itemId.levels.find(lvl => lvl.level === userItem.level);
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.energy -= 1;
    await user.save();

    res.json({ 
      level: userItem.level, 
      progress: userItem.progress, 
      energy: user.energy,
      name: currentItem.name,
      description: currentItem.description,
      image: currentItem.image
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
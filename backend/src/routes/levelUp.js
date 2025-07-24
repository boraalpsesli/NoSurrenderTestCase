const express = require('express');
const UserItem = require('../models/UserItem');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  const { itemId, userId } = req.body;
  if (!itemId || !userId) return res.status(400).json({ error: 'itemId and userId required' });

  let userItem;
  try {
    userItem = await UserItem.findOneAndUpdate(
      { userId, itemId, isLevelingUp: false },
      { $set: { isLevelingUp: true } },
      { new: true }
    ).populate('itemId');

    if (!userItem) return res.status(423).json({ error: 'Item is already being leveled up. Please wait.' });
    if (userItem.level >= 3) {
      userItem.isLevelingUp = false;
      await userItem.save();
      return res.status(400).json({ error: 'Max level reached' });
    }

    userItem.level += 1;
    userItem.progress = 0;
    await userItem.save();

    const currentItem = userItem.itemId.levels.find(lvl => lvl.level === userItem.level);

    const user = await User.findById(userId);
    if (!user) {
      userItem.isLevelingUp = false;
      await userItem.save();
      return res.status(404).json({ error: 'User not found' });
    }

    userItem.isLevelingUp = false;
    await userItem.save();

    res.json({
      level: userItem.level,
      progress: userItem.progress,
      energy: user.energy,
      name: currentItem.name,
      description: currentItem.description,
      image: currentItem.image
    });
  } catch (err) {
    if (userItem) {
      userItem.isLevelingUp = false;
      await userItem.save();
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
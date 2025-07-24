const express = require('express');
const router = express.Router();
const UserItem = require('../models/UserItem');

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userItems = await UserItem.find({ userId: userId }).populate('itemId');
    const result = userItems.map(ui => {
      const currentItem = ui.itemId.levels.find(lvl => lvl.level === ui.level);
      return {
        _id: ui.itemId._id,
        name: currentItem.name,
        type: ui.itemId.type,
        key: ui.itemId.key,
        level: currentItem.level,
        description: currentItem.description,
        image: currentItem.image,
        progress: ui.progress
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const UserItem = require('../models/UserItem');
const User = require('../models/User');

router.post('/', async (req, res) => {
  const { itemId, userId } = req.body;
  if (!itemId || !userId) return res.status(400).json({ error: 'itemId and userId required' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.energy < 1) return res.status(400).json({ error: 'Not enough energy' });

    const userItem = await UserItem.findOne({ userId, itemId });
    if (!userItem) return res.status(404).json({ error: 'UserItem not found' });

    if (userItem.level >= 3) {
      return res.status(400).json({ error: 'Max level reached' });
    }

    const newProgress = userItem.progress + 2;
    if (newProgress > 100) {
      return res.status(400).json({ 
        error: 'Progress cannot exceed 100%. Your item is ready to level up!' 
      });
    }

    userItem.progress = newProgress;
    await userItem.save();

    user.energy -= 1;
    await user.save();

    res.json({ progress: userItem.progress, energy: user.energy });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/bulk', async (req, res) => {
  const { itemId, clicks, userId } = req.body;
  
  if (!itemId || !clicks || !userId) {
    return res.status(400).json({ error: 'itemId, clicks, and userId required' });
  }
  
  if (clicks < 1 || clicks > 100) {
    return res.status(400).json({ error: 'clicks must be between 1 and 100' });
  }
 
        

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const energyRequired = clicks;
    if (user.energy < energyRequired) {
      return res.status(400).json({ 
        error: `Not enough energy. Required: ${energyRequired}, Available: ${user.energy}` 
      });
    }

    const userItem = await UserItem.findOne({ userId, itemId });
    if (!userItem) return res.status(404).json({ error: 'UserItem not found' });

    if (userItem.level >= 3) {
      return res.status(400).json({ error: 'Max level reached' });
    }

    const progressIncrease = clicks * 2;
    const newProgress = userItem.progress + progressIncrease;
    if(newProgress>100){
      return res.status(400).json(
        {
          error:"Item's Progress can not be increased  beyond its limit."
        }
      )
    }
    
    userItem.progress = newProgress;
    user.energy -= energyRequired;
    
    await Promise.all([userItem.save(), user.save()]);

    res.json({ 
      progress: userItem.progress, 
      energy: user.energy,
      clicksProcessed: clicks,
      progressIncreased: progressIncrease
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
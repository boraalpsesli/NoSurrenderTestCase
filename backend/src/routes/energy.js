const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const now = Date.now();
    let { energy, lastEnergyUpdate } = user;
    const maxEnergy = 100;
    const regenInterval = 2 * 60 * 1000;

    if (energy < maxEnergy) {
      const last = new Date(lastEnergyUpdate).getTime();
      const elapsed = now - last;
      const regenAmount = Math.floor(elapsed / regenInterval);

      if (regenAmount > 0) {
        energy = Math.min(maxEnergy, energy + regenAmount);
        lastEnergyUpdate = new Date(last + regenAmount * regenInterval);
        user.energy = energy;
        user.lastEnergyUpdate = lastEnergyUpdate;
        await user.save();
      }
    }

    res.json({ 
      energy, 
      lastEnergyUpdate: new Date(lastEnergyUpdate).toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 
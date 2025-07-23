const express = require('express');
const { energyObj } = require('../shared/data');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ energy: energyObj.value });
});

module.exports = router; 
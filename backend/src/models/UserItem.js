const mongoose = require('mongoose');

const userItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  level: { type: Number, default: 1, min: 1, max: 3 },
  progress: { 
    type: Number, 
    default: 0, 
    min: [0, 'Progress cannot be negative'], 
    max: [100, 'Progress cannot exceed 100%'] 
  },
  isLevelingUp: { type: Boolean, default: false },
});

module.exports = mongoose.model('UserItem', userItemSchema); 
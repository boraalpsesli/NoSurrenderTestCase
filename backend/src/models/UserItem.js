const mongoose = require('mongoose');

const userItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  level: { type: Number, default: 1 },
  progress: { type: Number, default: 0 },
});

module.exports = mongoose.model('UserItem', userItemSchema); 
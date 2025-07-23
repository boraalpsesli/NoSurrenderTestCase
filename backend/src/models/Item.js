const mongoose = require('mongoose');

const itemLevelSchema = new mongoose.Schema({
  level: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
});

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  levels: [itemLevelSchema],
});



module.exports = mongoose.model('Item', itemSchema);
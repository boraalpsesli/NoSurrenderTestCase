const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Item = require('../models/Item');
const UserItem = require('../models/UserItem');


async function seedUserItems() {
  await mongoose.connect(process.env.MONGO_URI);

  const users = await User.find();
  const items = await Item.find();

  for (const user of users) {
    for (const item of items) {
      const exists = await UserItem.findOne({ userId: user._id, itemId: item._id });
      if (!exists) {
        await UserItem.create({
          userId: user._id,
          itemId: item._id,
          level: 1,      
          progress: 0   
        });
      }
    }
  }

  console.log('UserItems seeded!');
  
}

module.exports = seedUserItems; 
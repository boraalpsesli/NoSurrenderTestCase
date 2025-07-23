const mongoose = require('mongoose');
require('dotenv').config();     

const User = require('../models/User');


const users = [
    {
        energy: 100,
        lastEnergyUpdate: new Date()
    },
    
]

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
    await User.insertMany(users);
    console.log('Users seeded!');
    
}

module.exports = seed;
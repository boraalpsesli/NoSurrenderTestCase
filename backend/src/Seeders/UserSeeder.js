const mongoose = require('mongoose');
require('dotenv').config();     

const User = require('../models/User');

const users = [
    {
        id: 1,
        username: 'admin',
        password: '123456', 
        energy: 100,
        lastEnergyUpdate: new Date()
    },
    {
       
        username: 'test',
        password: 'test123',
        level: 5,
        energy: 80,
        lastEnergyUpdate: new Date()
    },
    {

        username: 'demo',
        password: 'demo123',
        energy: 100,
        lastEnergyUpdate: new Date()
    }
]

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({});
    await User.insertMany(users);
    console.log('Users seeded with authentication credentials!');
    console.log('Available test accounts:');
    console.log('- Username: admin, Password: 123456');
    console.log('- Username: test, Password: test123');
    console.log('- Username: demo, Password: demo123');
    
}

module.exports = seed;
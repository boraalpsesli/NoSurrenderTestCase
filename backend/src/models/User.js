const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true,
        default: 1
    },
    energy: {
        type: Number,
        default: 100
    },
    lastEnergyUpdate: {
        type: Date,
        default: Date.now
    }
   
})




const User = mongoose.model('User', userSchema);

module.exports = User;
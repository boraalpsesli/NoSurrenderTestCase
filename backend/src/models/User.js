const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    energy: {
        type: Number,
        default: 100,
        min: 0,
        max: 100
    },
    lastEnergyUpdate: {
        type: Date,
        default: Date.now
    },
})




const User = mongoose.model('User', userSchema);

module.exports = User;
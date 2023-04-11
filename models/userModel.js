const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
}, { collection: 'users' });


module.exports = mongoose.model('UserModel', userSchema)
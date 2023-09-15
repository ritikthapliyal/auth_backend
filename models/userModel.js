const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    googleId: String,
    isAdmin: Boolean,
    email:String,
})

// Defines the User model based on the UserSchema and specifies the collection name as 'Users'
const User = mongoose.model('User', UserSchema, 'Users')

module.exports = User

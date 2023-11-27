const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Please add a full name"]
    },
    email: {
        type: String,
        unique:true,
        required: [true, "Please add a user email"]
    },
    userName: {
        type: String,
        unique:true ,
        required: [true, "Please add a user name"]
    },
    password: {
        type: String,
        required: [true, "Please add a  password"],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    posts: {
        type: Number,
        default: 0
    },
    followers: {
        type: Number,
        default: 0
    },
    following: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        default: ''
    },
    profilePic: {
        type: String,
        default: 'https://firebasestorage.googleapis.com/v0/b/instagram-clone-9f45e.appspot.com/o/default%2FNoPic.jpg?alt=media'
    },
    photos: {
        type: [String],
    }
})
schema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})
schema.methods.getSignedInToken = async function () {
    return jwt.sign({ id: this._id , userName:this.userName}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}
schema.methods.passwordChecker = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
module.exports = mongoose.model('user', schema);
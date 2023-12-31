const mongoose = require('mongoose');
const chatSchema = mongoose.Schema({
    chatName: {
        type: String, trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
},
    {
        timestamps: true
    })
module.exports = mongoose.model('Chat', chatSchema)
const asyncHandler = require('../middleware/async');
const ErrResponse = require('../utils/ErrorResponse')
const Chat = require('../modal/Chat');
const User = require('../modal/User');

exports.accessChat = asyncHandler(async (req, res, next) => {
    const id = req.user.id;
    const { userId } = req.body;
    if (!userId) {
        return next(new ErrResponse(`Please provide an userName in body`), 400)
    }
    let isChat = await Chat.findOne({
        isGroupChat: false,
        $and: [
            {
                users: { $elemMatch: { $eq: id } }
            },
            {
                users: { $elemMatch: { $eq: userId } }
            }
        ]
    }).populate({
        path: "users",
        select: "userName email"
    }).populate("lastMessage"/* {
        path: "lastMessage.sender",
        select: "userName email"
    } */);
    isChat = await User.populate(isChat, {
        path: "lastMessage.sender",
        select: "userName email"
    })
    if (isChat) {
        return res.status(200).json(isChat)
    }
    else {
        let newChat = {
            chatName: 'sender',
            isGroupChat: false,
            users: [id, userId]
        }
        const createdChat = await Chat.create(newChat);
        const fullChat = await Chat.findOne({ _id: createdChat.id }).populate('users', '-password')
        return res.status(200).json(fullChat)
    }

})

exports.fetchChats = asyncHandler(async (req, res, next) => {
    const id = req.user.id;
    let chats = await Chat.find({
        users: {
            $elemMatch: {
                $eq: id
            }
        }
    }).populate({
        path: "users",
        select: "userName email profilePic"
    }).populate("lastMessage"/*  {
        path: "lastMessage.sender",
        select: "userName email"
    } */)
    chats = await Chat.populate(chats,{
        path: "lastMessage.sender",
        select: "userName email"
    })
    return res.status(200).json(chats)
})

exports.createGroupChat = asyncHandler(async (req, res, next) => {
    const id = req.user.id;
    console.log(req.body);
    const body = req.body;
    if (!body.chatName || !body.users) {
        return next(new ErrResponse(`Please provide an chat name and users in body`), 400)
    }
    if (body.users.length > 2) {
        return next(new ErrResponse(`Group should have more than 2 members`), 400)
    }
    body.users.push(id);
    body.isGroupChat = true;
    body.groupAdmin = id;
    console.log(body)
    const createdChat = await Chat.create(body)
    const grpChat = await Chat.findOne({ _id: createdChat._id }).populate({
        path: "users",
        select: "userName email"
    }).populate({
        path: "groupAdmin",
        select: "userName email"
    })

    console.log(grpChat)
    return res.status(200).json(grpChat)
})

exports.renameGrpChat = asyncHandler(async (req, res, next) => {
    const { chatId, chatName } = req.body;
    const chat = await Chat.findByIdAndUpdate(chatId, { chatName }, {
        new: true
    }).populate({
        path: "users",
        select: "userName email"
    }).populate({
        path: "groupAdmin",
        select: "userName email"
    })
    if (!chat) {
        return next(new ErrResponse(`Invalid chat id`), 400)
    }
    return res.status(200).json(chat)
})

exports.addUsersInGrp = asyncHandler(async (req, res, next) => {
    const { chatId, users } = req.body;
    const chat = await Chat.findByIdAndUpdate(chatId, {
        $push: {
            users: {
                $each: users
            }
        }
    }, {
        new: true
    }).populate({
        path: "users",
        select: "userName email"
    }).populate({
        path: "groupAdmin",
        select: "userName email"
    })
    if (!chat) {
        return next(new ErrResponse(`Invalid chat id`), 400)
    }
    return res.status(200).json(chat)
})

exports.removeUsersInGrp = asyncHandler(async (req, res, next) => {
    const { chatId, user } = req.body;
    const chat = await Chat.findByIdAndUpdate(chatId, {
        $pull: {
            users: user
        }
    }, {
        new: true
    }).populate({
        path: "users",
        select: "userName email"
    }).populate({
        path: "groupAdmin",
        select: "userName email"
    })
    if (!chat) {
        return next(new ErrResponse(`Invalid chat id`), 400)
    }
    return res.status(200).json(chat)
})
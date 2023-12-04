const asyncHandler = require('../middleware/async');
const ErrResponse = require('../utils/ErrorResponse')
const Chat = require('../modal/Chat');
const Message = require('../modal/Message');
const User = require('../modal/User');

exports.createMessage = asyncHandler(async (req, res, next) => {
    const { content, chat } = req.body;
    if (!content || !chat) {
        return next(new ErrResponse(`Please provide an content and chat  in body`), 400)
    }

    const messageBody = {
        sender: req.user.id,
        content,
        chat
    }
    let message = await Message.create(messageBody);
    message = await Message.populate(message, {
        path: "sender",
        select: "userName email"
    })
    message = await message.populate('chat')
    message = await Chat.populate(message, {
        path: "chat.users",
        select: "userName email"
    })

    await Chat.findByIdAndUpdate(chat, { lastMessage: message })
    return res.status(200).json(message)
})

exports.getMessages = asyncHandler(async (req, res, next) => {
    const  chatId  = req.params.chatId;
    if(!chatId)
    {
        return next(new ErrResponse(`Please provide an chat id in params.chatId`), 400)
    }

    let messages = await Message.find({chat:chatId}).populate('sender',"userName email profilePic")
    return res.status(200).json(messages)
})
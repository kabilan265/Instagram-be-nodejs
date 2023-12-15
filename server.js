const express = require('express');
const app = express();
const dotenv = require("dotenv")
const connect = require('./config/db');
const authRoute = require('./routes/Auth')
const errHandler = require('./middleware/Error');
const cors = require('cors')
const userRoute = require('./routes/User')
const chatRoute = require('./routes/Chat')
const messageRoute = require('./routes/Message')
dotenv.config({ path: "./config/.env" })
const port = process.env.PORT;
connect();
app.use(express.json())
app.use(cors());
app.use('/user', userRoute)
app.use('/auth', authRoute);
app.use('/chat', chatRoute);
app.use('/message', messageRoute)

app.use(errHandler);
const server = app.listen(port, () => {
    console.log(` Server is up on ${port}`)
})

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:8080"
    }
})
io.on('connection', (socket) => {
    socket.on('setup', (userId) => {
        socket.join(userId)
        console.log(userId)
    })
    socket.off('setup', (userId) => {
        console.log("leave")
        socket.leave(userId)
    })
    socket.on('joinChat', (chatId) => {
        socket.join(chatId)
        console.log(chatId)
    })

    socket.on('sendMessage', (message) => {
        console.log(message)
        const chat = message.chat;
        if (!chat.users) {
            console.log("no users found!!!")
            return;
        }
        chat.users.forEach((user) => {
            console.log(user._id)
            if (user._id === message.sender._id) {
                return;
            }
            socket.on('ee', () => {
                console.log(ee)
            })
            socket.in(user._id).emit("messageReceived", message)
        })
    })
})


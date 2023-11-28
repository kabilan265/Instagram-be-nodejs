const express = require('express');
const app = express();
const dotenv = require("dotenv")
const connect = require('./config/db');
const authRoute = require('./routes/Auth')
const errHandler = require('./middleware/Error');
const cors = require('cors')
const userRoute = require('./routes/User')
/* dotenv.config({ path: "./config/.env" })
const port = process.env.port; */
connect();
app.use(express.json())
app.use(cors());
app.use('/user', userRoute)
app.use('/auth', authRoute);

app.use(errHandler);
const server = app.listen(/* port, () => {
    console.log(` Server is up on ${port}`)
} */)
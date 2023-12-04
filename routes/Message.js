const express = require('express')
const router = express();
const tokenCheck = require('../middleware/auth');
const { createMessage , getMessages} = require('../controller/Message')
router.route('/').post(tokenCheck, createMessage)
router.route('/:chatId').get(tokenCheck,getMessages)

module.exports = router;
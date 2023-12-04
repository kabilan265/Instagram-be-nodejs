const express = require('express')
const router = express();
const tokenCheck = require('../middleware/auth');

const {accessChat, fetchChats , createGroupChat , renameGrpChat ,addUsersInGrp,removeUsersInGrp} = require('../controller/Chat')
router.route('/').post(tokenCheck, accessChat).get(tokenCheck,fetchChats)
router.route('/group').post(tokenCheck, createGroupChat)
router.route('/group/rename').put(tokenCheck, renameGrpChat)
router.route('/group/add').put(tokenCheck, addUsersInGrp)
router.route('/group/remove').put(tokenCheck, removeUsersInGrp)

module.exports = router;
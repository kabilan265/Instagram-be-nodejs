const express = require('express');
const route = express.Router();
const {loginIn, signUp} = require('../controller/Auth')
route.route('/register').post( signUp);
route.route('/login').post(loginIn);
module.exports = route;
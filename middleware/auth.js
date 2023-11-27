const asyncHandler = require('../middleware/async');
const ErrResponse = require('../utils/ErrorResponse');
const User = require('../modal/User')
const jwt = require('jsonwebtoken');

const tokenCheck = asyncHandler(async (req, res, next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ErrResponse('Not authorized', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    }
    catch (err) {
        return next(new ErrResponse('Not authorized to access this route', 401));
    }


})
module.exports = tokenCheck;
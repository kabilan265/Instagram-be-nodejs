const asyncHandler = require('../middleware/async');
const ErrResponse = require('../utils/ErrorResponse')
const User = require('../modal/User')
exports.getUserDetails = asyncHandler(async (req, res, next) => {
    const id = req.user.id;
    console.log(id)
    const user = await User.findById(id);
    return res.status(200).json({ sucess: true, userDetails: user })
})

exports.isUserNameAlreadyExist = asyncHandler(async (req, res, next) => {
    if (!req.query.userName) {
        return next(new ErrResponse(`Please provide an userName`), 400)
    }
    const user = await User.findOne({
        userName: req.query.userName
    })
    console.log(user);
    let sucess = user ? false : true;
    return res.status(200).json({ sucess })
})

exports.updateUser = asyncHandler(async (req, res, next) => {
    const id = req.user.id;
    console.log(id)
    const { bio } = req.body;
    const user = await User.findByIdAndUpdate(id, { bio }, { new: true });
    return res.status(200).json({
        sucess: true,
        userDetails: user
    })
})
exports.uploadUserImage = asyncHandler(async (req, res, next) => {
    const id = req.user.id;
    const url = req.downloadURL;
    const user = await User.findByIdAndUpdate(id, { $push: { photos: url } }, { new: true }).select('photos');
    
    return res.status(200).json(user);
})

exports.updateProfilePic = asyncHandler(async (req, res, next)=>{
    const id = req.user.id;
    const url = req.downloadURL;
    const user = await User.findByIdAndUpdate(id, { profilePic: url }, { new: true }).select('profilePic');
    
    return res.status(200).json(user);
})
const express = require('express')
const router = express();
const { storeImage, resizeImage } = require('../middleware/multer')
const { getUserDetails, isUserNameAlreadyExist, updateUser, uploadUserImage, updateProfilePic } = require('../controller/User')
const tokenCheck = require('../middleware/auth');
const { uploadImage } = require('../middleware/fireBase')


router.route('/user-name-check').get(isUserNameAlreadyExist)
router.route('/').get(tokenCheck, getUserDetails).put(tokenCheck, updateUser)
router.route('/upload-image').post(tokenCheck, storeImage.single('image'), resizeImage, uploadImage, uploadUserImage)
router.route('/profile-pic').put(tokenCheck, storeImage.single('image'), resizeImage, uploadImage, updateProfilePic)
module.exports = router;
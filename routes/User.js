const express = require('express')
const router = express();
const { storeImage, resizeImage } = require('../middleware/multer')
const { getUserDetails, isUserNameAlreadyExist, updateUser, uploadUserImage, updateProfilePic, getProfiles } = require('../controller/User')
const tokenCheck = require('../middleware/auth');
const { uploadImage } = require('../middleware/fireBase')

const multer = require('multer');
const upload = multer();
router.route('/user-name-check').get(isUserNameAlreadyExist);
router.route('/').get(tokenCheck, getUserDetails).put(tokenCheck, updateUser);
router.route('/upload-image').post(tokenCheck, upload.single('image'),/* storeImage.single('image'), resizeImage, */ uploadImage, uploadUserImage);
router.route('/profile-pic').put(tokenCheck, upload.single('image'), /* resizeImage, */ uploadImage, updateProfilePic);
router.route('/search/:name').get(tokenCheck, getProfiles);
module.exports = router;
const asyncHandler = require('../middleware/async');
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('../config/firebaseConfig')
const ErrResponse = require('../utils/ErrorResponse')
const {getStorage, ref  ,uploadBytesResumable , getDownloadURL} = require('firebase/storage')

const firebase = initializeApp(firebaseConfig);
const storage = getStorage();
exports.uploadImage = asyncHandler(async (req, res, next) => {
   console.log("----------------------------")
    console.log(req.file)
    console.log('firebase start->',Date.now())
    const metaData = {
        contentType: req.file.mimetype,
    };
    const userName = req.user.userName;
    const uniqueName = Date.now();
    let path =`/${userName}/profile-pic/unique`;
    
    if(req.path.indexOf('/upload-image') >= 0)
    {
        path =`/${userName}/${uniqueName}`;
    }
    const storageRef = ref(storage ,path);
    const uploadTask = uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metaData
    );
    uploadTask.on(
        "state_changed",
        (snapshot) => {
            console.log("progress");
        },
        (error) => {
            console.log(error)
            return next(new ErrResponse(`Server error while uploading images`), 500);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                req.downloadURL = downloadURL;
                console.log('firebase end->',Date.now())
                next();
            }).catch(()=>{
                return next(new ErrResponse(`Server error while uploading images`), 500);
            })
           
        })
})
const multer = require('multer');
const ErrResponse = require('../utils/ErrorResponse');
const sharp = require('sharp');
/* const multerStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null , 'public/img/users')
    },
    filename: (req,file,cb)=>{
     const ext = file.mimetype.split('/')[1];
     cb(null, `${Date.now()}.${ext}`)
    }
}) */
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new ErrResponse('Not an image', 400), false)
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})
exports.storeImage = upload;
exports.resizeImage = async (req, res, next) => {
    if (!req.file) {
        next();
    }
    let size = 200;
    if (req.path.indexOf('/upload-image') >= 0) {
        size = 500;
    }
    req.file.buffer = await sharp(req.file.buffer).resize(size, size).toFormat('jpeg').jpeg({ quality: 90 }).toBuffer();
    next();
}
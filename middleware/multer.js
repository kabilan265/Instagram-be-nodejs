const multer = require('multer');
const ErrResponse = require('../utils/ErrorResponse');
const sharp = require('sharp');
const path = require('path');
const upload = multer();
//const multerStorage = multer.memoryStorage({ buffer: 1024 * 1024 * 10 });
const multerStorage = multer.diskStorage({
    destination: path.resolve(__dirname, '..', 'uploads'),
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        cb(null, `${Date.now()}.${ext}`)
    },
})
const multerFilter = (req, file, cb) => {
    console.log('Multer start->', Date.now())
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new ErrResponse('Not an image', 400), false)
    }
}
/* const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
}) */
exports.storeImage = upload;



exports.resizeImage = async (req, res, next) => {
    console.log('Multer end->', Date.now())
    if (!req.file) {
        next();
    }
    let size = 200;
    if (req.path.indexOf('/upload-image') >= 0) {
        size = 500;
    }
    req.file.buffer = await sharp(req.file.path).resize(size, size).toFormat('jpeg').jpeg({ quality: 90 }).toBuffer();
    require('fs').unlinkSync(req.file.path);
    console.log('sharp end->', Date.now())
    next();
}
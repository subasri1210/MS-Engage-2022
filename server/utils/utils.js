const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'images'));
    },
    filename: function (req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
            var err = new Error();
            err.code = 'filetype';
            return cb(err);
        } else {
            var fileName = crypto.randomBytes(10).toString('hex');
            file.filename = fileName;
            const ext = file.mimetype.split('/')[1];
            cb(null, fileName + `.${ext}`);
        }
    }
});

var upload = multer({
    storage: storage
}).single('image');

const checkAuth = async (req, res, next) => {
    try {
        console.log('inside check auth');
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log('token', token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        });
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

module.exports = {
    handleMultiPart: upload,
    checkAuth
};

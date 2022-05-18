const rootRouter = require('express').Router();
const authController = require('../controllers/auth.controller');
const utils = require('../utils/utils');

rootRouter.post('/signup', utils.handleMultiPart, authController.register);

rootRouter.post('/login', authController.login);

rootRouter.post('/facelogin', utils.handleMultiPart, authController.faceLogin);

rootRouter.get('/checkToken', utils.checkAuth, (req, res) => {
    res.status(200).send({
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email
        }
    });
});

module.exports = rootRouter;

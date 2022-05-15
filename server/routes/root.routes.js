const rootRouter = require('express').Router();
const authController = require('../controllers/auth.controller');
const utils = require('../utils/utils');

rootRouter.post('/signup', utils.handleMultiPart, authController.register);

rootRouter.post('/login', authController.login);

rootRouter.post('/facelogin', utils.handleMultiPart, authController.faceLogin);

module.exports = rootRouter;

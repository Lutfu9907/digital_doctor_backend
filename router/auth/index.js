const MainRouter = require('express').Router();

MainRouter.use('/register', require('./register'));
MainRouter.use('/login', require('./login'));
MainRouter.use('/authMiddleware', require('./authMiddleware'));
MainRouter.use('/authRouter', require('./authRouter'));

module.exports = MainRouter;

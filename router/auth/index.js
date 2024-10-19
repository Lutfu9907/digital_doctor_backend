const MainRouter = require('express').Router();

MainRouter.use('/register', require('./register'));
MainRouter.use('/login', require('./login'));
MainRouter.use('/authMiddleware', require('./authMiddleware'));
MainRouter.use('/authRouter', require('./authRouter'));
MainRouter.use('/logout', require('./logout'));

module.exports = MainRouter;

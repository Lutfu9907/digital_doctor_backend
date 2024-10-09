const MainRouter = require('express').Router();

MainRouter.use('/register', require('./register'));
MainRouter.use('/login', require('./login'));
MainRouter.use('/forgot-password', require('./forgot-password'));
MainRouter.use('/reset-password',require('./reset-password'));

module.exports = MainRouter;

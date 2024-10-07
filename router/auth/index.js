const MainRouter = require('express').Router();

MainRouter.use('/register', require('./register'));
MainRouter.use('/login', require('./login'));

module.exports = MainRouter;

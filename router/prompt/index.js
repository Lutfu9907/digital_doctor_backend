const MainRouter = require('express').Router();

MainRouter.use('/promptHandler',require('./promptHandler'));
MainRouter.use('/newChat',require('./newChat'));

module.exports = MainRouter;
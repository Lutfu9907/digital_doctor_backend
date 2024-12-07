const MainRouter = require('express').Router();

MainRouter.use('/promptHandler',require('./promptHandler'));
MainRouter.use('/newChat',require('./newChat'));
MainRouter.use('/ttsHandler',require('./ttsHandler'));
MainRouter.use('/chatDatabase',require('./chatDatabase'));

module.exports = MainRouter;
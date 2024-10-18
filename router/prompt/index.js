const MainRouter = require('express').Router();

MainRouter.use('/promptHandler',require('./promptHandler'));

module.exports = MainRouter;
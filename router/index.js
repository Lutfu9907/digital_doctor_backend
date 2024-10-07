module.exports = function (app) {
  app.use('/auth', require('./auth'));
  app.use('/prompt', require('./prompt'));
};

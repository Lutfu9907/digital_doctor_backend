const MainRouter = require('express').Router();
const authMiddleware = require('./authMiddleware');
const User = require('../../models/User');

MainRouter.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = MainRouter;

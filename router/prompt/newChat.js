const MainRouter = require('express').Router();
const ChatHistory = require('../../models/ChatHistory');
const authMiddleware = require('../auth/authMiddleware');

MainRouter.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  console.log('Yeni Sohbet için Kullanıcı ID:', userId);

  try {
    const newChat = new ChatHistory({
      userId,
      history: [],
      createdAt: new Date(),
    });
    const savedChat = await newChat.save();

    res
      .status(201)
      .json({ message: 'Yeni sohbet oluşturuldu', chat: savedChat });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Sohbet oluşturulurken hata oluştu', error });
  }
});

module.exports = MainRouter;

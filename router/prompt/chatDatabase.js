const MainRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const ChatHistory = require('../../models/ChatHistory');

MainRouter.get('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Yetkisiz erişim, token yok' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const chats = await ChatHistory.find({ userId }).sort({
      'history.timestamp': -1,
    });

    const chatSummary = chats.map((chat) => ({
      id: chat._id,
      title: `Sohbet Başlangıcı: ${chat.history[0]?.content || 'Başlangıç Mesajı Yok'}`,
    }));

    res.json({ chats: chatSummary });
  } catch (error) {
    console.error('Sohbet geçmişi hatası:', error);
    return res
      .status(500)
      .json({ message: 'Sunucu hatası, lütfen tekrar deneyin' });
  }
});

module.exports = MainRouter;

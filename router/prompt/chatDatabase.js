const MainRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const ChatHistory = require('../../models/ChatHistory');

MainRouter.get('/', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Yetkisiz erişim' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      const chats = await ChatHistory.find({ userId }).sort({ createdAt: -1 });
      const chatSummary = chats.map(chat => ({
        id: chat._id,
        title: `Sohbet ${chat._id.toString().substring(19, 24)}`,
      }));
  
      res.json({ chats: chatSummary });
    } catch (error) {
      console.error('Sohbet geçmişi hatası:', error);
      res.status(500).send('Sunucu hatası');
    }
  });
  
  module.exports=MainRouter;
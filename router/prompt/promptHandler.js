const MainRouter = require('express').Router();
const { sendMessageToOpenAI } = require('../../clients/openai');

let messages = [];

MainRouter.post('/', async (req, res) => {
  const userMessage = req.body.message;

  messages.push({
    role: 'user',
    content: userMessage,
  });

  try {
    const assistantMessage = await sendMessageToOpenAI(messages);

    messages.push({
      role: 'assistant',
      content: assistantMessage,
    });

    res.send(assistantMessage);
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    res.status(500).send('Sunucu hatası');
  }
});

module.exports = MainRouter;

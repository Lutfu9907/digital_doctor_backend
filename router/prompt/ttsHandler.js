const MainRouter = require('express').Router();
const { convertTextToSpeech } = require('../../clients/tts');
const path = require('path');

MainRouter.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mesaj boş olamaz!' });
  }

  try {
    const audioFilePath = await convertTextToSpeech(message);

    res.json({
      message: message,
      audioUrl: `http://localhost:3000/temp/${path.basename(audioFilePath)}`,
    });
  } catch (error) {
    console.error('Hata:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = MainRouter;

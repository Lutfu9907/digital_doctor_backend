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
    console.log('Ses dosyası yolu:',audioFilePath);

    res.json({
      audioUrl: `http://localhost:3000/temp/${path.basename(audioFilePath)}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = MainRouter;

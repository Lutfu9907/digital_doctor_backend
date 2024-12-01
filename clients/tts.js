const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');

const client = new textToSpeech.TextToSpeechClient();

const convertTextToSpeech = async (text) => {
  try {
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const request = {
      input: { text },
      voice: { languageCode: 'tr-TR', ssmlGender: 'MALE' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);

    const fileName = `output-${Date.now()}.mp3`;
    const filePath = path.join(tempDir, fileName);
    await fs.promises.writeFile(filePath, response.audioContent, 'binary');

    return fileName;
  } catch (error) {
    console.error('TTS dönüştürme hatası:', error.message);
    throw new Error('TTS dönüştürme başarısız.');
  }
};

schedule.scheduleJob('*/10 * * * *', () => {
  const tempDir = path.join(__dirname, 'temp');
  fs.readdir(tempDir, (err, files) => {
    if (err) {
      console.error('Temp dosyaları okunamadı:', err.message);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(tempDir, file);
      const stats = fs.statSync(filePath);

      if (Date.now() - stats.mtimeMs > 10 * 60 * 1000) {
        fs.unlink(filePath, (err) => {
          if (err) console.error('Dosya silinemedi:', err.message);
        });
      }
    });
  });
});

module.exports = { convertTextToSpeech };

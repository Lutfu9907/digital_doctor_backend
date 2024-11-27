const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

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

    const filePath = path.join(tempDir, `output-${Date.now()}.mp3`);
    await fs.promises.writeFile(filePath, response.audioContent, 'binary');
    console.log(`Ses dosyası oluşturuldu: ${filePath}`);

    return filePath;
  } catch (error) {
    console.error('TTS dönüştürme hatası:', error.message);
    throw new Error('TTS dönüştürme başarısız.');
  }
};

module.exports = { convertTextToSpeech };

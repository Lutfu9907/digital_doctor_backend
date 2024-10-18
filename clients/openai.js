const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sendMessageToOpenAI = async (messages) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API çağrısı sırasında hata:', error);
    throw new Error('OpenAI API ile bağlantı hatası');
  }
};

module.exports = { sendMessageToOpenAI };

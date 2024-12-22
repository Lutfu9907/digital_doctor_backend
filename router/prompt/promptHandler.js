const MainRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const ChatHistory = require('../../models/ChatHistory');
const { sendMessageToOpenAI } = require('../../clients/openai');

MainRouter.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Yetkisiz erişim' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const userMessage = req.body.message;
    const chatId = req.body.chatId;

    let messages = [
      {
        role: 'system',
        content: `Sen bir sağlık danışmanısın ve yalnızca sağlık konularında bilgi veriyorsun.

            Kullanıcı bir şikayet belirttiğinde:

            Öncelikle bu şikayeti anlamak için yaşam tarzı, beslenme alışkanlıkları ve şikayetin detaylarıyla ilgili 3 soru sor.
            Soruları net ve anlaşılır şekilde oluştur.
            Kullanıcı sorulara yanıt verdikten sonra:

            Sağlık, yaşam tarzı ve beslenme ile ilgili önerilerde bulun.
            Önerilerin net, açık ve 250-300 kelimeyi aşmayacak şekilde olsun.
            Gereksiz detaylardan kaçın ve yalnızca kullanıcının ihtiyacı olan bilgiyi sun.
            Önerilerin sonunda şayet kullanıcının durumu ciddiyse, mutlaka doktora gitmesini öner.

            Kullanıcı yeni bir soru sorduğunda:

            Öncelikle yanıt ver, ardından gerekirse bir veya iki soru sor. Sürekli soru sormaktan kaçın ve kullanıcıyı bunaltma.
            Şikayet ve önerilerle ilgili yazımlarını maksimum 500 karakter içinde mümkün olduğunca eksiksiz oluştur. `,
      },
    ];

    let chatHistory;

    if (chatId) {
      chatHistory = await ChatHistory.findById(chatId);
      if (!chatHistory) {
        return res.status(404).json({ message: 'Sohbet bulunamadı' });
      }
    } else {
      chatHistory = new ChatHistory({
        userId,
        history: [],
      });
    }

    chatHistory.history.forEach((chat) => {
      messages.push({
        role: chat.contextType === 1 ? 'user' : 'assistant',
        content: chat.content,
      });
    });

    messages.push({
      role: 'user',
      content: userMessage,
    });

    const assistantMessage = await sendMessageToOpenAI(messages);

    chatHistory.history.push({
      contextType: 1,
      content: userMessage,
    });

    chatHistory.history.push({
      contextType: 2,
      content: assistantMessage,
    });

    await chatHistory.save();

    res.json(assistantMessage);
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    res.status(500).send('Sunucu hatası');
  }
});

module.exports = MainRouter;

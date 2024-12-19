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
        
        Ciddi sağlık sorunları için güvenilir tıbbi literatüre dayalı spesifik bilgiler ver. 
        
        Kullanıcı şikayetini söyledikten sonra ilk mesajda 3 tane soru sor gelen cevaplar neticesinde direkt olarak önerilerde bulun.
        Sonrasında hastanın bulgularını değerlendirip ilaç önerisinde bulun ve son olarak cümlenin sonunda doktora gitmesini öner.

        Yanıtlarını 250-300 kelimeyi aşmayacak şekilde tut.
        Gereksiz detaylardan kaçın ve yalnızca kullanıcıya gerekli olan bilgileri sun.
 
        Cümlelerini tam, açık ve anlaşılır şekilde oluştur; yazım ve imla kurallarına dikkat et.

        Hastanın mevcut durumunu analiz ederek önerilerde bulun; sağlık durumu kötüleşiyorsa acil müdahale gerektiren önerilerde bulun.
        Hastanın belirttiği semptomlara göre özel tedavi önerileri yap ve kullanıcının sağlık geçmişine uygun yanıtlar ver.
        
        Eğer cevabın tamamlanmadıysa,
        Yanıtın devamını görmek ister misiniz?' şeklinde soru sor.
        Cevabı mutlaka tamamla eksik cevap yazma.`,
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

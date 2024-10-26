const ChatHistory = require('../../models/ChatHistory');
const User = require('../../models/User');
const MainRouter = require('express').Router();
const { sendMessageToOpenAI } = require('../../clients/openai');
const jwt = require('jsonwebtoken');

MainRouter.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Yetkisiz erişim' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    console.log('user ID', userId);

    const userMessage = req.body.message;

    let messages = [
      {
        role: 'system',
        content: `Sen bir sağlık danışmanısın ve yalnızca sağlık konularında bilgi veriyorsun. 
        
        Ciddi sağlık sorunları için güvenilir tıbbi literatüre dayalı spesifik bilgiler ver. 
        
        Kullanıcı şikayetini söyledikten sonra 3 tane soru sor gelen cevaplar neticesinde ilk önce doğal önerilerde bulun
        örneğin, eğer karnı ağrıyorsa sıcak su torbası gibi önerilerde bulun.Sonrasında hastanın bulgularını değerlendirip 
        ilaç önerisinde bulun ve son olarak cümlenin sonunda doktora gitmesini öner.
        
        Yanıtlarını kısa, net ve öz tut. Gerektiğinde kullanıcının sorularına göre daha fazla ayrıntı ver. 
        Cümlelerini tam, açık ve anlaşılır şekilde oluştur; yazım ve imla kurallarına dikkat et.
        
        Ayrıca, önceki konuşmaları analiz et ve hastanın verdiği bilgilere dayanarak uygun sorular sor. 
        Hastanın mevcut durumunu analiz ederek önerilerde bulun; sağlık durumu kötüleşiyorsa acil müdahale gerektiren önerilerde bulun.
        Hastanın belirttiği semptomlara göre özel tedavi önerileri yap ve kullanıcının sağlık geçmişine uygun yanıtlar ver.
        
        Sağlık dışı konularda none dön.

        Yanıtın çok uzun olabileceğini fark ettiğinde, yanıtı 150 token'dan fazla vermemeye çalış. Eğer cevabın tamamlanmadıysa,
        Yanıtın devamını görmek ister misiniz?' şeklinde soru sor.
        Cevabı mutlaka tamamla eksik cevap yazma.`,
      },
    ];

    let chatHistory = await ChatHistory.findOne({ userId });

    if (!chatHistory) {
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

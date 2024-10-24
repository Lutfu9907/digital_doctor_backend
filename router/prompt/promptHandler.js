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

    const healthKeywords = [
      // Vücut Bölümleri
      'baş', 'göz', 'kulak', 'burun', 'boğaz', 'karın', 'mide', 'bacak', 'kol', 'el', 'ayak', 'omuz', 'sırt', 'bel','organ',

      // Yaygın Semptomlar
      'ağrı', 'ateş', 'yorgunluk', 'nefes darlığı', 'öksürük', 'bulantı', 'kusma', 'ishal', 'kabızlık', 'şişlik', 'kızarıklık',
      'uyuşma', 'karıncalanma', 'baş dönmesi', 'üşüme', 'terleme', 'cilt', 'kaşıntı', 'kanama', 'yaralanma',

      // Ciddi Sağlık Durumları
      'ana arter', 'kalp krizi', 'kan pıhtısı', 'şiddetli kanama', 'koma', 'beyin kanaması', 'inme', 'boğulma',

      // Yaygın Hastalıklar
      'grip', 'soğuk algınlığı', 'nezle', 'zatürre', 'bronşit', 'enfeksiyon', 'şeker hastalığı', 'yüksek tansiyon', 'astım', 'alerji',
      'depresyon', 'anksiyete', 'migren', 'sinüzit', 'göz iltihabı', 'kulak iltihabı', 'diş ağrısı', 'kalp krizi', 'felç', 'kanser',

      // İlaçlar ve Tedavi Türleri
      'ilaç', 'antibiyotik', 'ağrı kesici', 'antidepresan', 'iğne', 'serum', 'ameliyat', 'röntgen', 'ultrason', 'kan tahlili',
      'MR', 'tomografi', 'fizik tedavi', 'psikoterapi',

      // Sağlıkla İlgili Genel Konular
      'beslenme', 'diyet', 'egzersiz', 'uyku', 'sigara', 'alkol', 'kilo', 'stres', 'sağlıklı yaşam', 'spor', 'vitamin', 'mineral',
      'probiyotik', 'lif', 'protein', 'karbonhidrat', 'şeker', 'tuz', 'kolesterol', 'kan basıncı', 'kalori', 'su tüketimi', 'hidrasyon'
    ];

    const isHealthRelated = healthKeywords.some((keyword) =>
      userMessage.toLowerCase().includes(keyword)
    );

    if (!isHealthRelated) {
      return res.send(
        'Ben yalnızca sağlıkla ilgili konularda yardımcı olabilirim.'
      );
    }

    let messages = [
      {
        role: 'system',
        content: `Sen bir sağlık danışmanısın ve yalnızca sağlık konularında bilgi veriyorsun. 
        Kullanıcılardan ağrının türü ve şiddeti hakkında daha fazla bilgi isteyerek, uygun tedavi yöntemleri öner. 
        İlaç tavsiyesinde bulunabilirsin, ancak her durumda doktora gitmelerini tavsiye et. 
        Ciddi sağlık sorunları için güvenilir tıbbi literatüre dayalı spesifik bilgiler ver. 
        Sağlık dışı soruları yanıtlama ve yalnızca sağlıkla ilgili konularda yardımcı olabileceğini belirt. 
        Yanıtlarını kısa, net ve öz tut. Gerektiğinde kullanıcının sorularına göre daha fazla ayrıntı ver. 
        Cümlelerini tam, açık ve anlaşılır şekilde oluştur; yazım ve imla kurallarına dikkat et.`,
      },
    ];

    
    let chatHistory = await ChatHistory.findOne({ userId });
    
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId,
        history: []
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
      content: assistantMessage
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

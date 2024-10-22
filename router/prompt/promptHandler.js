const MainRouter = require('express').Router();
const { sendMessageToOpenAI } = require('../../clients/openai');

MainRouter.post('/', async (req, res) => {
  const userMessage = req.body.message;

  const healthKeywords = [
    // Vücut Bölümleri
    'baş', 'göz', 'kulak', 'burun', 'boğaz', 'karın', 'mide', 'bacak', 'kol', 'el', 'ayak', 'omuz', 'sırt', 'bel',
  
    // Yaygın Semptomlar
    'ağrı', 'ateş', 'yorgunluk', 'nefes darlığı', 'öksürük', 'bulantı', 'kusma', 'ishal', 'kabızlık', 'şişlik', 'kızarıklık', 
    'uyuşma', 'karıncalanma', 'baş dönmesi', 'üşüme', 'terleme', 'cilt', 'kaşıntı', 'kanama', 'yaralanma',
  
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
      content: `Sen bir sağlık danışmanısın. Kullanıcılara ağrının türü ve şiddeti hakkında daha fazla bilgi istemek için sorular sor ve tedavi yöntemleriyle ilgili önerilerde bulun. 
      Kullanıcıların sağlık durumuna göre spesifik öneriler sun, ilaç önerisi yap, ancak her durumda doktora gitmelerini öner.`,
    },
  ];

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

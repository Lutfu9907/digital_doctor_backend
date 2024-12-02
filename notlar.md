backend.
- şifre eu standartlarında oluşturulsun hem frontend de hem backend de kontrol et

- OpenAI API'ye iki ayrı istek gönderilmesinden kaynaklanıyor. sendMessage fonksiyonunda, bir yanıt promptHandler aracılığıyla metin olarak alınıyor, başka bir yanıt ise ttsHandler aracılığıyla sesli olarak alınıyor. Ancak bu iki API çağrısı aynı mesajı kullanmıyor olabilir veya OpenAI API farklı cevaplar üretiyor olabilir.

- aynı zamanda temp te her iki istekten dolayı 2 adet .mp3 uzantılı dosya oluşuyor ve kaydoluyor.

- Axios ile Avatar İşlemi:
Kullanıcının avatar yükleme işlemi için axios kütüphanesi kullanılacak. Kullanıcı avatar seçip yüklediğinde, bu istek axios ile backend'e gönderilir.
Avatar resmi backend tarafından işlenip, sunucuya kaydedilir.


backend.
- şifre eu standartlarında oluşturulsun hem frontend de hem backend de kontrol et

- AI'dan gelen yanıtı seslendirmek için, OpenAI API'si ile alınan yanıtı da TTS API'sine gönderip seslendirmek gerekiyor.
Şu an, backend sadece kullanıcının mesajını alıp seslendiriyor, ancak OpenAI API yanıtını alıp onu seslendirme kısmı eksik.

- Axios ile Avatar İşlemi:
Kullanıcının avatar yükleme işlemi için axios kütüphanesi kullanılacak. Kullanıcı avatar seçip yüklediğinde, bu istek axios ile backend'e gönderilir.
Avatar resmi backend tarafından işlenip, sunucuya kaydedilir.


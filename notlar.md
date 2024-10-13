backend.
- auth middlewaresini yaz
- şifre eu standartlarında oluşturulsun hem fe de hem be de kontrol et
- kullanıcı işlemlerinde bilgi dönme. şifre veya kullanıcı adı hatalı mesajı dön. yada sistem hatası mesajı. detay verme.


Axios ile Avatar İşlemi:
Kullanıcının avatar yükleme işlemi için axios kütüphanesi kullanılacak. Kullanıcı avatar seçip yüklediğinde, bu istek axios ile backend'e gönderilir.
Avatar resmi backend tarafından işlenip, sunucuya kaydedilir.

Utils ya da Helpers Klasörü:
Proje içerisinde utils veya helpers adında bir klasör oluşturulacak.
Bu klasörün içinde clients adında bir alt klasör yer alacak.
clients klasörüne openai.js dosyası eklenecek. Bu dosyada, OpenAI ile ilgili tüm işlemler axios kullanılarak yapılacak.

Env Dosyası:
Proje içerisinde .env dosyasına token eklenecek. Bu token, OpenAI API talepleri için kullanılacak.
Ayrıca .env dosyasının .gitignore dosyasında olup olmadığı kontrol edilecek. .env dosyası gizli olduğu için Git'e gönderilmemesi gerekir.

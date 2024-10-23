backend.
- şifre eu standartlarında oluşturulsun hem frontend de hem backend de kontrol et
- kullanıcının prompt session u tutucaz


promptSession=[{userId:1,history:[
  
  {
  contextType:1, //user 2 gpt
  content: "birşeyler"
}

{
  contextType:2, 
  content: "gpt den gelen mesaj"
}
]},

{userId:2,history:[{
  contextType:1, //user 2 gpt
  content: "birşeyler"
}]}

]

promptSession.push({userd:1,history:[]}) login olurken bunu kullanacaksın.

Axios ile Avatar İşlemi:
Kullanıcının avatar yükleme işlemi için axios kütüphanesi kullanılacak. Kullanıcı avatar seçip yüklediğinde, bu istek axios ile backend'e gönderilir.
Avatar resmi backend tarafından işlenip, sunucuya kaydedilir.


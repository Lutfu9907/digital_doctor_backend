const MainRouter = require('express').Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../../models/User');  


MainRouter.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Lütfen geçerli bir e-posta adresi girin.' });
  }

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Bu e-posta ile kayıtlı bir kullanıcı bulunamadı.' });
    }

   
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 haneli kod
    const resetCodeExpires = Date.now() + 3600000; // 1 saat geçerli olacak

    
    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      to: user.email,
      from: 'no-reply@yourapp.com',
      subject: 'Şifre Sıfırlama Kodu',
      text: `Şifrenizi sıfırlamak için bu kodu kullanın: ${resetCode}\n\nBu kod 1 saat boyunca geçerli olacaktır.`
    };

    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Şifre sıfırlama e-postası gönderilemedi.', error });
      }
      res.status(200).json({ message: 'Şifre sıfırlama kodu e-posta ile gönderildi.' });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Bir hata oluştu.', error });
  }
});

module.exports = MainRouter;

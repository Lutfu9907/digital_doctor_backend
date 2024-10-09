const MainRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../../models/User'); 

MainRouter.post('/', async (req, res) => {
    const { email, resetCode, newPassword } = req.body;
  
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ message: 'Lütfen gerekli bilgileri sağlayın.' });
    }
  
    try {
      
      const user = await User.findOne({
        email,
        resetCode,
        resetCodeExpires: { $gt: Date.now() } 
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş sıfırlama kodu.' });
      }
  
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetCode = undefined; 
      user.resetCodeExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Şifre başarıyla sıfırlandı.' });
    } catch (error) {
      return res.status(500).json({ message: 'Şifre sıfırlama sırasında bir hata oluştu.', error });
    }
  });

  module.exports = MainRouter;
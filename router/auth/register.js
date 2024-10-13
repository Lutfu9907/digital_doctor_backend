const MainRouter = require('express').Router();
const User = require('../../models/User'); 

MainRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email ve şifre gereklidir.' });
  }

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email zaten kayıtlı.' });
    }

    const newUser = new User({
      email,
      password
    });

    await newUser.save();

    return res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi.' });
  } catch (error) {
    return res.status(500).json({ message: 'Kullanıcı kaydı sırasında bir hata oluştu.', error });
  }
});

module.exports = MainRouter;

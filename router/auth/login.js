const MainRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

MainRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email ve şifre gereklidir' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı bilgileri' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı bilgileri' });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Token:', token);
    return res.status(200).json({ message: 'Giriş başarılı', token });
  } catch (error) {
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = MainRouter;

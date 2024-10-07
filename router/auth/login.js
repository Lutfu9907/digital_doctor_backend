const MainRouter = require('express').Router();
const jwt = require('jsonwebtoken');

MainRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email ve şifre gereklidir' });
  }

  if (email === 'test@example.com' && password === '1234') {
    const user = { email };

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Token:', token);

    return res.status(200).json({ message: 'Giriş başarılı', token });
  } else {
    return res.status(401).json({ message: 'Geçersiz kullanıcı bilgileri' });
  }
});

module.exports = MainRouter;

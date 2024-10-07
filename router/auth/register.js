const MainRouter = require('express').Router();
const bcrypt = require('bcrypt');

const users = [];

MainRouter.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email ve şifre gereklidir.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });

    return res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi.' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Kullanıcı kaydı sırasında bir hata oluştu.' });
  }
});

module.exports = MainRouter;

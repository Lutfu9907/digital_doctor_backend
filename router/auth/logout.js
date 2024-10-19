const MainRouter = require('express').Router();

MainRouter.post('/', (req, res) => {
  try {
    res.status(200).json({ message: 'Çıkış işlemi başarılı.' });
  } catch (error) {
    console.error('Çıkış işlemi hatası:', error);
    res
      .status(500)
      .json({ message: 'Çıkış işlemi sırasında bir hata oluştu.' });
  }
});

module.exports = MainRouter;

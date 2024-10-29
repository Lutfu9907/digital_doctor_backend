const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Auth Header:', authHeader);

  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log('Token yok veya eksik');
    return res.status(401).json({ message: 'Yetkisiz erişim' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.log('Token doğrulama hatalı', error);
    return res
      .status(401)
      .json({ message: 'Geçersiz veya süresi dolmuş token' });
  }
};

module.exports = authMiddleware;

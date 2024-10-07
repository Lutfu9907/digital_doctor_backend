const express = require('express');
const mongoose=require('mongoose');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log('MongoDB bağlantısı başarılı');
}).catch((error) => {
  console.error('MongoDB bağlantısı hatası:', error);
});

app.get('/', (req, res) => {
  res.send('hello world');
});

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const router = require('./router');
router(app);

console.log(process.env.PORT);
app.listen(process.env.PORT);



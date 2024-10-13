const express = require('express');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

router(app);

mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log('MongoDB bağlantısı başarılı');
}).catch((error) => {
  console.error('MongoDB bağlantısı hatası:', error);
});

console.log(process.env.PORT);
app.listen(process.env.PORT);



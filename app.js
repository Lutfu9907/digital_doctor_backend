const express = require('express');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router');
const path = require('path');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/temp', express.static(path.join(__dirname, 'clients', 'temp')));


router(app);

mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log('MongoDB bağlantısı başarılı');
}).catch((error) => {
  console.error('MongoDB bağlantısı hatası:', error);
});

console.log(process.env.PORT);
app.listen(process.env.PORT);



const express = require('express');
require('dotenv').config();
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const router = require('./router');
router(app);

app.get('/', (req, res) => {
  res.send('hello world');
});
console.log(process.env.PORT);
app.listen(process.env.PORT);

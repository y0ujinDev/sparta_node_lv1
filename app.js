require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

const productsRouter = require('./routes/products.router.js');
const connect = require('./schemas');
connect();

app.use(express.json());
app.use('/api', [productsRouter]);

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(port, () => {
  console.log(`${port} 포트로 서버 열림.`);
});

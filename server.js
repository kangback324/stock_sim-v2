require('dotenv').config();
const express = require('express');
const app = express();
const logWithTime = require('./lib/logger.js');
const root_router = require('./routes/root.js');
const stock_router = require('./routes/stock.js');
const session = require('express-session');
const cors = require('cors')
const pretty = require('./lib/prettyrespone.js')
const path = require('path');
require('./lib/PriceUpdate.js')

app.use(cors());
app.use(express.urlencoded({ extended: true })); //x-www-form-urlencoded 방식, 그래서 객체 형태로 결과나옴
app.use(express.json());
app.use(session({
  secure: false,  // https 환경에서만 session 정보를 주고받도록처리
  secret: 'stock-3c-sim-v2',
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //   maxAge: 1000 * 60 * 60 * 24, // 24 hours
  //   secure: true,
  //   httpOnly : true
  // },
}));

app.use('/', root_router);
app.use('/stock', stock_router);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chart.html'));
});

app.use((req, res)=>{
  pretty(404, req, res, "Not Found")
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  pretty(500, req, res, "internet server error")
});


const PORT = 3000;
app.listen(PORT, () => {
  logWithTime(`Server is running on http://localhost:${PORT}`);
});

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
const morgan = require('morgan');

require('./lib/PriceUpdate.js');

const PORT = 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secure: true,
  secret: 'StockSimulator-Backend',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secure: true,
    httpOnly : true
  },
}));

app.use((req, res, next) => {
  const clientIp =
  req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
  console.log(`클라이언트 IP: ${clientIp}`);
  next();
})

app.use('/', root_router);
app.use('/stock', stock_router);

app.use((req, res)=>{
  pretty(404, req, res, "Not Found")
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  pretty(500, req, res, "internet server error")
});

app.listen(PORT, "0.0.0.0", () => {
  logWithTime(`Server is running on http://localhost:${PORT}`);
});

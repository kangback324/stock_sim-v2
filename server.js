require('dotenv').config();
const express = require('express');
const app = express();
const logWithTime = require('./lib/logger.js');
const root_router = require('./routes/root.js');
const stock_router = require('./routes/stock.js');
const session = require('express-session');
const cors = require('cors')
require('./lib/PriceUpdate.js')

app.set('view engine', 'ejs');
app.set('views', './views')

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
  // store: new MongoStore({
  //   url: 'mongodb://localhost/sessions'
  // })
}));

app.use('/', root_router);
app.use('/stock', stock_router);

app.get('/', (req, res) => {
  res.render('index');
});

app.use((req, res)=>{
  res.status(404).send("404 Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" }); // 에러 응답
});


const PORT = 3000;
app.listen(PORT, () => {
  logWithTime(`Server is running on http://localhost:${PORT}`);
});

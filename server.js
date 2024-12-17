require('dotenv').config();
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
const express = require('express');
const app = express();
const logWithTime = require('./lib/logger.js');
const root_router = require('./routes/root.js');
const stock_router = require('./routes/stock.js');
const session = require('express-session');
const cors = require('cors')
const pretty = require('./lib/prettyrespone.js')
const morgan = require('morgan');

require('./lib/PriceUpdate.js');

const PORT = 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secure: false,
  secret: 'StockSimulator-Backend',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secure: false,
    httpOnly : true
  },
}));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StockSimulator",
      version: "1.0.0",
      description:
        "StockSimulator",
      license: {
        // name: "MIT",
        // url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        // name: "LogRocket",
        // url: "https://logrocket.com",
        // email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

// app.use(morgan('combined'));
app.use(morgan('dev'));
app.use('/', root_router);
app.use('/stock', stock_router);

const specs = swaggerJsdoc(options);
app.use("/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

app.use((req, res)=>{
  pretty(404, req, res, "Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  pretty(500, req, res, "internet server error")
});



app.listen(PORT, "0.0.0.0", () => {
  logWithTime(`Server is running on http://localhost:${PORT}`);
});

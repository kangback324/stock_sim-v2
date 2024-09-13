const logWithTime = require('./logger.js')

/* MySQL */
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'stock_3c',
  waitForConnections: true, // 대기 중인 연결을 기다리도록 설정
  connectionLimit: 100, // 최대 연결 수
  queueLimit: 0 // 대기열 제한 (무제한)
});

module.exports = pool;

/* mongo-db */
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/{databaseid}"
);

const mdb = mongoose.connection;
const handleOpen = () => logWithTime("Successfully Connected to MongoDB");
const handleError = error => logWithTime(`Error on MongoDB Connection: ${error}`);

mdb.once("open", handleOpen);
mdb.on("error", handleError);

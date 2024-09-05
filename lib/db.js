const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'stock_3c',
  waitForConnections: true, // 대기 중인 연결을 기다리도록 설정
  connectionLimit: 100, // 최대 연결 수
  queueLimit: 0 // 대기열 제한 (무제한)
});

module.exports = pool;
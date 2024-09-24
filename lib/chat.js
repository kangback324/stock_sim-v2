const logWithTime = require('../lib/logger');
const socket = require('socket.io');
const pool = require('./db.js');

/*
    
*/

async function sendMessage(sendBy, message) {
    const db = await pool.getConnection();
    try{
        await db.query(`INSERT INTO chat_log (userId, content) VALUES(${sendBy}, ${message})`);
    } catch (err) {
        logWithTime(err);
    } finally {
        db.release();
    }
};

/*
async function loadMessage(params) {
    
}
*/
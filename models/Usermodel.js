const pool = require('../lib/db.js');
const isowner = require('../lib/isowner.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.signup = async (req, res) => {
    const db = await pool.getConnection();
    try {
        const [double_id] = await db.query('select * from user where user_id=?',[req.body.id]);
        if (double_id.length > 0) {
            return { status: 400, message : "400 doubleduplicate ID" }
        }   
        else {
            const hashedPassword = await bcrypt.hash(req.body.pw, saltRounds);
            await db.query('insert into user (user_id, password, money) values(?,?,?)',[req.body.id, hashedPassword, 1000000]);
            return { status: 200, message: "200 signup success" };
        }
    } catch (err) {
        console.log(err);
        return { status : 500, message : "500 (signup) internet server error" };
    } finally {
        db.release();
    }
};

exports.login = async (req) => {
    const db = await pool.getConnection();
    try {
        const [user] = await db.query('select * from user where user_id = ?', [req.body.id]);
        if (user.length > 0) {
            const passwordMatch = await bcrypt.compare(req.body.pw, user[0].password);
            if (passwordMatch) {
                req.session.user_id = req.body.id;
                return { status: 200, message: "200 login success" };
            } else {
                return { status: 400, message: "400 not match login failed" };
            }
        } else {
            return { status: 400, message: "400 not match login failed" };
        }
    } catch (err) {
        console.log(err);
        return { status: 500, message: "500 (login) internet server error" };
    } finally {
        db.release();
    }
};

exports.logout = async (req) => {
    const db = await pool.getConnection();
    try {
        delete req.session.user_id;
        return { status: 200, message: "200 logout success" };
    } catch (err) {
        console.log(err);
        return { status: 500, message: "500 (login) internet server error" };
    } finally {
        db.release();
    }
};

exports.isowner = async (req) => {
    const db = await pool.getConnection();
    if (await isowner(req)) {
        try {
            const [user] = await db.query('select money from user where user_id = ?',[req.session.user_id]);
            const result = {
                user_id : req.session.user_id,
                money : user[0].money
            }
            return { status: 200, message: result };
        } catch (err) {
            console.log(err);
            return { status: 500, message: "500 (isowner) internet server error" };
        } finally {
            db.release();
        }
    } else {
        return { status: 400, message: "Not login" };
    }
}
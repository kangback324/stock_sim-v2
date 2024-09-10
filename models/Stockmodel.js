const isowner = require('../lib/isowner.js');
const pool = require('../lib/db.js');

// 매수
exports.buy = async (req) => {
    if (await isowner(req)) {
        const db = await pool.getConnection();
        try {
            const [stock_inform] = await db.query('select * from stock_inform where name = ?', [req.body.stock_name]);
            const [user] = await db.query('select * from user where user_id = ?',[req.session.user_id]);
            const [stock_user] = await db.query('select * from stock_user where account_id = ?',[user[0].account_id]);

            // 유효성 검사
            if (stock_inform[0].status === 'N' || stock_inform[0].status === undefined) {
                return { status: 400, message: "404 Not found stock" };
            }
            if (isNaN(Number(req.body.number)) || Number.isInteger(Number(req.body.number)) === false || Number(req.body.number) < 0) {
                return { status: 400, message: "400 wrong number" };
            }
            if (user[0].money < stock_inform[0].price * req.body.number) {
                return { status: 400, message: "400 Not enough money" };
            }

            //로그 남기기
            await db.query('insert into stock_log values(?, ?, ?, "buy", now())',[user[0].account_id,stock_inform[0].stock_id,req.body.number]);

            //이미 가지고 있는지 확인후 계좌에 추가
            const [result] = await db.query('select * from stock_user where account_id = ? AND stock_id = ?',[user[0].account_id, stock_inform[0].stock_id]);
            if (result.length > 0) {
                const new_average = ((stock_user[0].average_price * stock_user[0].stock_number)+(stock_inform[0].price * req.body.number)) / (Number(stock_user[0].stock_number) + Number(req.body.number));
                const new_number = Number(req.body.number) + Number(stock_user[0].stock_number);
                await db.query('update stock_user set stock_number = ?, average_price = ?',[new_number, new_average]);
            } else {
                await db.query('insert into stock_user values(?, ?, ?, ?)',[user[0].account_id, stock_inform[0].stock_id, req.body.number, stock_inform[0].price]);
            }

            //돈 줄이기 , (수수료 로직 추가 하기)
            await db.query('update user set money = ? where account_id = ?',[user[0].money - (stock_inform[0].price * req.body.number), user[0].account_id]);
            return { status: 200, message: "200 success !" };     
        } catch (err) {
            console.log(err);
            return { status: 500, message: "500 (buy) internet server error" };
        } finally {
            await db.release();
        }
    }
    else {
        return { status: 400, message: "failed (No login User)" };
    }
}


//매도
exports.sell = async (req, res) => {
    if (await isowner(req)) {
        const db = await pool.getConnection();
        try {
            return { status: 200, message: "Success" };
        } catch (err) {
            console.log(err);
            return { status: 500, message: "500 (sell) internet server error" };
        } finally {
            await db.release();
        }
    }
    else {
        return { status : 400, message : "faild (No login User)" }
    }
}

//체결로그 조회
exports.log = async (req, res) => {
    const db = await pool.getConnection();
    try {
        //조회 결과는 30개로 제한함 
        const [result] = await db.query('SELECT si.name AS stock_name, sl.stock_number, sl.trading_type, sl.trading_at FROM stock_log sl INNER JOIN stock_inform si ON sl.stock_id = si.stock_id ORDER BY trading_at desc limit 30');
        return { status: 200, message: result };
    } catch (err) {
        console.log(err);
        return { status: 500, message: "500 (log) internet server error" };
    } finally {
        await db.release();
    }
}

//계좌 조회
exports.my_account = async (req, res) => {
    if (await isowner(req)) {
        const db = await pool.getConnection();
        try {
            const [user] = await db.query('select * from user where user_id = ?',[req.session.user_id]);
            const [result] = await db.query('SELECT si.name AS stock_name, su.stock_number, su.average_price FROM stock_user su INNER JOIN stock_inform si ON su.stock_id = si.stock_id where account_id = ?'
            ,[user[0].account_id]);
            return { status: 200, message: result };
        } catch (err) {
            console.log(err);
            return { status: 500, message: "500 (my_account) internet server error" };

        } finally {
            await db.release();
        }
    }
    else {
        return { status : 400, message : "faild (No login User)" }
    }
}
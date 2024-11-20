const isowner = require('../lib/isowner.js');
const logWithTime = require('../lib/logger.js')
const pool = require('../lib/db.js');

// 매수
//stock_name
//number
exports.buy = async (req) => {
    const db = await pool.getConnection();
    try {
        await db.beginTransaction();
        const [stock_inform] = await db.query('select * from stock_inform where name = ?', [req.body.stock_name]);
        const [user] = await db.query('select * from user where user_id = ?',[req.session.user_id]);
        const [stock_user] = await db.query('select * from stock_user where account_id = ?',[user[0].account_id]);
        // 유효성 검사
        if (stock_inform.length === 0 || stock_inform[0].status === 'N') {
            return { status: 400, message: "Not found stock" };
        }
        if (isNaN(Number(req.body.number)) || Number.isInteger(Number(req.body.number)) === false || Number(req.body.number) < 0) {
            return { status: 400, message: "wrong number" };
        }
        if (user[0].money < stock_inform[0].price * req.body.number) {
            return { status: 400, message: "Not enough money" };
        }
        //로그 남기기
        await db.query('insert into stock_log values(?, ?, ?, "buy", now(), ?)',[user[0].account_id,stock_inform[0].stock_id,req.body.number, stock_inform[0].price]);

        //돈 줄이기 , (수수료 로직 추가 하기)
        await db.query('update user set money = ? where account_id = ?',[user[0].money - (stock_inform[0].price * req.body.number), user[0].account_id]);
        
        //이미 가지고 있는지 확인후 계좌에 추가
        const [result] = await db.query('select * from stock_user where account_id = ? AND stock_id = ?',[user[0].account_id, stock_inform[0].stock_id]);
        if (result.length > 0) {
            const new_average = ((stock_user[0].average_price * stock_user[0].stock_number)+(stock_inform[0].price * req.body.number)) / (Number(stock_user[0].stock_number) + Number(req.body.number));
            const new_number = Number(req.body.number) + Number(stock_user[0].stock_number);
            await db.query('update stock_user set stock_number = ?, average_price = ?',[new_number, new_average]);
        } else {
            await db.query('insert into stock_user values(?, ?, ?, ?)',[user[0].account_id, stock_inform[0].stock_id, req.body.number, stock_inform[0].price]);
        }
        await db.commit();
        return { status: 200, message: "success" };     
    } catch (err) {
        logWithTime(err);
        await db.rollback();
        return { status: 500, message: "internet server error" };
    } finally {
        db.release();
    }
}


//매도
exports.sell = async (req) => {
    const db = await pool.getConnection();
    try {
        await db.beginTransaction();
        // 유효성 검사
        const [user] = await db.query('select account_id, money from user where user_id = ?', [req.session.user_id]);
        const [stock] = await db.query('select stock_id, status, price from stock_inform where name = ?',[req.body.stock_name]);
        if (stock.length === 0 || stock[0].status === 'N') {
            return { status: 400, message: "Not found stock" };
        }
        if (isNaN(Number(req.body.number)) || Number.isInteger(Number(req.body.number)) === false || Number(req.body.number) < 0) {
            return { status: 400, message: "wrong number" };
        }
        //뭐 샀는지 조회
        const [stock_user] = await db.query('select stock_number from stock_user where account_id = ? AND stock_id = ?',[user[0].account_id, stock[0].stock_id]);
        if (stock_user[0] === undefined) {
            return { status: 400, message: "Not have" };
        }
        const new_number = stock_user[0].stock_number - req.body.number;
        if (new_number < 0) {
                return { status: 400, message: "wrong number" };
        }
        //로그 남기기
        await db.query('insert into stock_log values(?, ?, ?, "sell", now(), ?)',[user[0].account_id,stock[0].stock_id,req.body.number, stock[0].price]);
        //주식 제거하기
        if (stock_user[0].stock_number - req.body.number === 0) {
            await db.query('delete from stock_user where account_id = ? AND stock_id = ?',[user[0].account_id, stock[0].stock_id]);
        } else {
            await db.query('update stock_user set stock_number = ? where account_id =? AND stock_id = ?',[new_number, user[0].account_id, stock[0].stock_id]);
        }
        //돈주기, (수수료 로직 추가하기)
        await db.query('update user set money = ? where account_id = ?',[user[0].money + (stock[0].price * req.body.number) ,user[0].account_id]);
        await db.commit();
        return { status: 200, message: "success !" };
    } catch (err) {
        logWithTime(err);
        await db.rollback();
        return { status: 500, message: "internet server error" };
    } finally {
        db.release();
    }
}

//주식 조회
exports.stock_inform = async (req) => {
    const db = await pool.getConnection();
    let result;
    try {
        if (req.params.stock_id === "all") {
            [result] = await db.query('select * from stock_inform');
        }
        else {
            [result] = await db.query('select * from stock_inform where stock_id = ?',[req.params.stock_id]);
        }
        return { status : 200, message : result};
    } catch (err) {
        logWithTime(err)
        return { status : 500, message : "internet server error"};
    } finally {
        db.release();
    }
}

//체결로그 조회
exports.stock_log = async (req) => {
    const db = await pool.getConnection();
    try {
        //조회 결과는 30개로 제한함 
        const [result] = await db.query('SELECT si.name AS stock_name, sl.stock_number, sl.trading_type, sl.price, sl.trading_at FROM stock_log sl INNER JOIN stock_inform si ON sl.stock_id = si.stock_id where sl.stock_id = ? ORDER BY trading_at desc limit 30', [req.params.stock_id]);
        return { status: 200, message: result };
    } catch (err) {
        logWithTime(err);
        return { status: 500, message: "internet server error" };
    } finally {
        await db.release();
    }
}

/* 어느 주식을 조회할것 인지 인자로 받아야됨  */
exports.stock_pricelog = async (req) => {
    const db = await pool.getConnection();
    let result;
    try {
        [result] = await db.query(`
            SELECT 
                stock_id,
                DATE_FORMAT(log_at, '%Y-%m-%d %H:%i') AS minute,
                MIN(price) AS low,
                MAX(price) AS high,
                SUBSTRING_INDEX(GROUP_CONCAT(price ORDER BY log_at ASC), ',', 1) AS open,
                SUBSTRING_INDEX(GROUP_CONCAT(price ORDER BY log_at DESC), ',', 1) AS close
            FROM stock_pricelog
            WHERE stock_id = ?
            --   AND log_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
            GROUP BY stock_id, minute
            ORDER BY minute
`,[req.params.stock_id]);
        return { status: 200, message: result };
    } catch (err) {
        logWithTime(err)
        return { status: 500, message: "internet server error" };
    } finally {
        db.release();
    }
}


//계좌 조회
exports.my_account = async (req) => {
    const db = await pool.getConnection();
    try {
    const [user] = await db.query('select * from user where user_id = ?',[req.session.user_id]);
    const [result] = await db.query('SELECT si.name AS stock_name, su.stock_number, su.average_price FROM stock_user su INNER JOIN stock_inform si ON su.stock_id = si.stock_id where account_id = ?'
        ,[user[0].account_id]);
        return {
            status: 200, message: {
            money : user[0].money,
            stock : result
         }};
    } catch (err) {
        logWithTime(err);
        return { status: 500, message: "internet server error" };
        
    } finally {
        await db.release();
    }
}
    
//랭킹 조회
exports.user_rank = async () => {
    const db = await pool.getConnection();
    try {
        const [result] = await db.query('select user_id, money from user ORDER BY money desc limit 10')
        return {status : 200, message : result};
    } catch (err) {
        logWithTime(err);
        return { status : 500, message : "internet server error" }
    } finally {
        db.release();
    }
}

const isowner = require('../lib/isowner.js');
const logWithTime = require('../lib/logger.js')
const pool = require('../lib/db.js');

// 매수
exports.buy = async (req) => {
    const db = await pool.getConnection();
    try {
        const [stock_inform] = await db.query('select * from stock_inform where name = ?', [req.body.stock_name]);
        const [user] = await db.query('select * from user where user_id = ?',[req.session.user_id]);
        const [stock_user] = await db.query('select * from stock_user where account_id = ?',[user[0].account_id]);
        // 유효성 검사
        if (stock_inform.length === 0 || stock_inform[0].status === 'N') {
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
        return { status: 200, message: "200 success !" };     
    } catch (err) {
        logWithTime(err);
        return { status: 500, message: "500 (buy) internet server error" };
    } finally {
        await db.release();
    }
}


//매도
exports.sell = async (req) => {
    console.log("ㄴㅁㅇ")
    const db = await pool.getConnection();
    try {
        // 유효성 검사
        //account_id 조회
        const [user] = await db.query('select account_id, money from user where user_id = ?', [req.session.user_id]);
        //stock_id 조회
        const [stock] = await db.query('select stock_id, status, price from stock_inform where name = ?',[req.body.stock_name]);
        if (stock[0] === undefined || stock[0].status === 'N') {
            return { status: 400, message: "404 Not found stock" };
        }
        if (isNaN(Number(req.body.number)) || Number.isInteger(Number(req.body.number)) === false || Number(req.body.number) < 0) {
            return { status: 400, message: "400 wrong number" };
        }
        //뭐 샀는지 조회
        const [stock_user] = await db.query('select stock_number from stock_user where account_id = ? AND stock_id = ?',[user[0].account_id, stock[0].stock_id]);
        if (stock_user[0] === undefined) {
            return { status: 400, message: "400 Not have" };
        }
        const new_number = stock_user[0].stock_number - req.body.number;
        if (new_number < 0) {
                return { status: 400, message: "400 wrong number" };
        }
        
        //로그 남기기
        await db.query('insert into stock_log values(?, ?, ?, "sell", now())',[user[0].account_id,stock[0].stock_id,req.body.number]);

        //주식 제거하기
        if (stock_user[0].stock_number - req.body.number === 0) {
            await db.query('delete from stock_user where account_id = ? AND stock_id = ?',[user[0].account_id, stock[0].stock_id]);
        } else {
            await db.query('update stock_user set stock_number = ? where account_id =? AND stock_id = ?',[new_number, user[0].account_id, stock[0].stock_id]);
        }

        //돈주기, (수수료 로직 추가하기)
        await db.query('update user set money = ? where account_id = ?',[user[0].money + (stock[0].price * req.body.number) ,user[0].account_id])

        return { status: 200, message: "200 Success !" };
    } catch (err) {
        logWithTime(err);
        return { status: 500, message: "500 (sell) internet server error" };
    } finally {
        await db.release();
    }
}

/* MCSPI 지수전용으로 짜여있음 일반주식에 대한 선물거래를 만들면 수정해야됨 */
/*
    {
        futures_name : 
        contract :
        leverage :
    }
    ex )
        {
        futures_name : MCSPI
        contract : 3
        leverage : 2.5
    }
*/
exports.buy_futures = async (req) => {
    const db = await pool.getConnection();
    try {
        const [futures] = await db.query('select * from futures_inform where name = ?',[req.body.futures_name]);
        const [user] = await db.query('select * from user where user_id = ?',[req.session.user_id]);
        const useing_money = (req.body.leverage * (futures[0].price * 1500)) * (10 / 100)
        //구매할때 배율 X (구매시 지수 포인트 X 1500) 의 10%가 계좌에 돈이 있어야됨
        if (user[0].price <  useing_money) {
            return { status : 400, message : "faild (Not have money)" };
        } 
        if (user[0].price >= useing_money) {
            //추매시 추매했을때 배율이 다른 계약이 들어올경우 같은 포지션이여도 다른 계약으로 취급
            const [check] = await db.query('select * from where account_id = ? AND ')
        }
        else {
            logWithTime("error : buy_futures");
            logWithTime(req.body)
        }
    } catch (err) {
        logWithTime(err)
    } finally {
        db.release();
    }
//만약 배율이 같은 계약일 경우
//선물 만기일은 구매일로 부터 12시간 12시간이 지나면 자동청산
//수익률이 -100%가 되면 투자자 보호를 위해 강제 청산
//수익률 = ((구매한 당시의 지수 포인트) - (현재 지수 포인트)) * 1500 * 배율
}

exports.sell_futures = async (req) => {
    
}

//주식 조회
exports.stock_inform = async () => {
    const db = await pool.getConnection();
    try {
        const [result] = await db.query('select * from stock_inform');
        return { status : 200, message : result};
    } catch (err) {
        logWithTime(err)
        return { status : 500, message : "500 (stock) internet server error"};
    } finally {
        db.release();
    }
}

//체결로그 조회
exports.stock_log = async () => {
    const db = await pool.getConnection();
    try {
        //조회 결과는 30개로 제한함 
        const [result] = await db.query('SELECT si.name AS stock_name, sl.stock_number, sl.trading_type, sl.trading_at FROM stock_log sl INNER JOIN stock_inform si ON sl.stock_id = si.stock_id ORDER BY trading_at desc limit 30');
        return { status: 200, message: result };
    } catch (err) {
        logWithTime(err);
        return { status: 500, message: "500 (Stock_log) internet server error" };
    } finally {
        await db.release();
    }
}


exports.stock_pricelog = async () => {
    const db = await pool.getConnection();
    try {
        const [result] = await db.query('select * from stock_pricelog');
        
        return { status: 200, message: result };
    } catch (err) {
        logWithTime(err)
        return { status: 500, message: "500 (Pricelog) internet server error" };
    } finally {
        db.release();
    }
}

exports.futures_inform = async () => {
    const db = await pool.getConnection();
    try {
        const [result] = await db.query('select * from futures_inform');
        return { status: 200, message: result };
    } catch (err) {
        logWithTime(err)
        return { status: 500, message: "500 (Pricelog) internet server error" };
    } finally {
        db.release();
    }
}

exports.futures_pricelog = async () => {
    const db = await pool.getConnection();
    try {
        const [result] = await db.query('select * from futures_pricelog');
        return { status: 200, message: result };
    } catch (err) {
        logWithTime(err)
        return { status: 500, message: "500 (Pricelog) internet server error" };
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
        return { status: 200, message: result };
    } catch (err) {
        logWithTime(err);
        return { status: 500, message: "500 (my_account) internet server error" };
        
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
        return { status : 500, message : "500 (rank) internet server error" }
    } finally {
        db.release();
    }
}

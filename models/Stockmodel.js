const isowner = require('../lib/isowner.js');
const pool = require('../lib/db.js');
exports.buy = async (req) => {
    // if (await isowner(req)) {
        const db = await pool.getConnection();
        try {
            const [stock_inform] = await db.query('select * from stock_inform where name = ?', [req.body.stock_name]);
            const [user] = await db.query('select * from user where user_id = ?',[123456]);
            const [stock_user] = await db.query('select * from stock_user where account_id = ?',[user[0].account_id]);

            if (stock_inform[0].status === 'N' || stock_inform[0].status === undefined) {
                return { status: 400, message: "404 Not found stock" };
            }
            if (isNaN(Number(req.body.number)) || Number.isInteger(Number(req.body.number)) === false || Number(req.body.number) < 0) {
                return { status: 400, message: "400 wrong number" };
            }
            if (user[0].money < stock_inform[0].price * req.body.number) {
                return { status: 400, message: "400 Not enough money" };
            }

            await db.query('insert into stock_log values(?, ?, ?, "buy", now())',[user[0].account_id,stock_inform[0].stock_id,req.body.number]);
            const [result] = await db.query('select * from stock_user where account_id = ? AND stock_id = ?',[user[0].account_id, stock_inform[0].stock_id]);
            
            if (result.length > 0) {
                const new_average = ((stock_user[0].average_price * stock_user[0].stock_number)+(stock_inform[0].price * req.body.number)) / (Number(stock_user[0].stock_number) + Number(req.body.number));
                const new_number = Number(req.body.number) + Number(stock_user[0].stock_number);
                await db.query('update stock_user set stock_number = ?, average_price = ?',[new_number, new_average]);
            } else {
                await db.query('insert into stock_user values(?, ?, ?, ?)',[user[0].account_id, stock_inform[0].stock_id, req.body.number, stock_inform[0].price]);
            }

            await db.query('update user set money = ? where account_id = ?',[user[0].money - (stock_inform[0].price * req.body.number), user[0].account_id]);

            return { status: 200, message: "200 성공 !" };
            // 매수 로직
            // 유효한 거래인지 검사
            /*
                1.존재 하는 종목인가 (상장폐지, 알수없는 종목)
                2.돈이 그만큼 있는가 (etc..)
            */
            //거래 로직
            /*
                1.체결로그에 로그를 올린다.
                2.유저계좌에 매수한 만큼의 주식의 갯수를 올린다. (만일 유저가 그 주식을 산적이 없으면 새로운 레코드를 추가한다.)
                2-1 평단가도 재조정 한다.
                3.계좌에 매수금을 뺀다.
                3-1. 수수료를 발생시키고 싶을경우 판매금의 ( 미정%를 추가한 돈을 추가한뒤 뺀다.)
            */     
        } catch (err) {
            console.log(err);
            return { status: 500, message: "500 (buy) internet server error" };
        } finally {
            await db.release();
        }
    // }
    // else {
    //     return { status: 400, message: "failed (No login User)" };
    // }
}


exports.sell = async (req, res) => {
    if (await isowner(req)) {
        //매도하는 코드
        const db = await pool.getConnection();
        try {
            // 유효한 거래인지 검사
            /*
                1.존재 하는 종목인가 (상장폐지, 알수없는 종목)
                2.계좌에 해당주식과 그만큼의 주식이 존재하는가 (더 많은 수량을 매도 했을경우 etc..)
            */
            //거래 로직
            /*
                1.체결로그에 로그를 올린다.
                2.유저계죄에서 그만큼의 주식을 삭제한다 (만일 수량이 0이되면 해당레코드를 삭제한다.)
                3.계좌에 판매금을 넣는다).
                3-1. 수수료를 발생시키고 싶을경우 판매금의 ( 미정%를 제외한 돈을 넣어준다).
            */
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

exports.log = async (req, res) => {
    if (await isowner(req)) {
        //체결로그 확인 하는 코드
        const db = await pool.getConnection();
        try {
            return { status: 200, message: "Success" };
        } catch (err) {
            console.log(err);
            return { status: 500, message: "500 (log) internet server error" };
        } finally {
            await db.release();
        }
    }
    else {
        return { status : 400, message : "faild (No login User)" };
    }
}

exports.my_account = async (req, res) => {
    if (await isowner(req)) {
        //계좌 조회 하는 코드
        const db = pool.getConnection();
        try {
            return { status: 200, message: "Success" };
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
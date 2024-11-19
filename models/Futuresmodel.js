const pool = require('../lib/db.js')
const logWithTime = require('../lib/logger.js');


/*
{
    futures_name : 
    contract_number :
    leverage :
    position : 
    }
    */
   
   /* MCSPI 지수전용으로 짜여있음 일반주식에 대한 선물거래를 만들면 수정해야됨 */
   //구매, 추매 할때 총 계약금의 10%가 계좌에 돈이 있어야됨
   //추매시 추매했을때 배율이 다른 계약이 들어올경우 같은 포지션이여도 다른 계약으로 취급
   //선물 만기일은 구매일로 부터 12시간 12시간이 지나면 자동청산
   //수익금 = ((구매한 당시의 지수 포인트) - (현재 지수 포인트)) * 1500 * 배율
   
exports.buy_futures = async (req) => {
    const db = await pool.getConnection();
    try {
        await db.beginTransaction();
        const [futures] = await db.query('select * from futures_inform where name = ?',[req.body.futures_name]);
        const [user] = await db.query('select * from user where user_id = ?',[req.session.user_id]);
        const useing_money = ((req.body.leverage * futures[0].price * 1500 * req.body.contract_number) * 0.1);

        //구매시 10% 돈 있는지 확인
        if (user[0].money <  useing_money) {
            return { status : 400, message : "faild (Not have money)" };
        }
        else if (user[0].money >= useing_money) {
            const [check] = await db.query('select * from futures_user where account_id = ? AND futures_id = ? AND leverage = ? AND position = ?',
            [user[0].account_id, futures[0].futures_id, req.body.leverage, req.body.position]);
            
            //같은 계약인지 확인
            if (check.length === 0) {
                await db.query('insert into futures_user values(?, ?, ?, ?, ?, ?, now())',
                [user[0].account_id, futures[0].futures_id, req.body.contract_number, futures[0].price, req.body.position, req.body.leverage]);
            }
            else {
                const New_number = (Number(check[0].contract_number) + Number(req.body.contract_number))
                const New_average = ((Number((check[0].average_price * check[0].contract_number)) + Number((futures[0].price * req.body.contract_number))) / New_number).toFixed(2);
                const useing_money2 = ((req.body.leverage * New_average * 1500 * New_number) * 0.1);

                //구매시 10% 돈 있는지 확인 2 (추매시)
                if (useing_money2 > user[0].money) {
                    return { status : 400, message : "faild (Not have money)" };
                }

                await db.query('update futures_user set contract_number = ?, average_price = ? where account_id = ? AND futures_id = ? AND leverage = ? AND position = ?'
                ,[New_number, New_average, user[0].account_id, futures[0].futures_id, check[0].leverage, check[0].position])
            }
        }
        await db.commit();
        return { status: 200, message: "200 success" };
    } catch (err) {
        logWithTime(err)
        await db.rollback();
        return { status: 500, message: "500 (buy-futures) internet server error" };
    } finally {
        db.release();
    }
}


exports.sell_futures = async (req) => {
    const db = await pool.getConnection();
    try {
        await db.beginTransaction();
        // 선물 판매 로직
        await db.commit();
    } catch (err) {
        logWithTime(err)
        await db.rollback();
    } finally {
        db.release();
    }
}

exports.futures_inform = async (req) => {
    const db = await pool.getConnection();
    let result;
    try {
        if (req.params.futures_id === "all") {
            [result] = await db.query('select * from futures_inform');
        }
        else {
            [result] = await db.query('select * from futures_inform where futures_id = ?',[req.params.futures_id]);
        }
        return { status: 200, message: result };
    } catch (err) {
        logWithTime(err)
        return { status: 500, message: "500 (Pricelog) internet server error" };
    } finally {
        db.release();
    }
}

exports.futures_pricelog = async (req) => {
    const db = await pool.getConnection();
    try {
        if (req.params.futures_id === "all") {
            [result] = await db.query('select * from futures_pricelog');
        } else {
            [result] = await db.query('select * from futures_pricelog where futures_id = ?',[req.params.futures_id]);
        }
        return { status: 200, message: result };
    } catch (err) {
        logWithTime(err)
        return { status: 500, message: "500 (Pricelog) internet server error" };
    } finally {
        db.release();
    }
}
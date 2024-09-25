const pool = require('../lib/db.js')
const logWithTime = require('../lib/logger.js');

/* MCSPI 지수전용으로 짜여있음 일반주식에 대한 선물거래를 만들면 수정해야됨 */
/*
    {
        futures_name : 
        contract_number :
        leverage :
        position : 
    }
    ex )
    {
        futures_name : MCSPI
        contract_number : 3
        leverage : 2.
        position : long
    }
*/

exports.buy_futures = async (req) => {
    const db = await pool.getConnection();
    try {
        await db.beginTransaction();
        const [futures] = await db.query('select * from futures_inform where name = ?',[req.body.futures_name]);
        const [user] = await db.query('select * from user where user_id = ?',[req.session.user_id]);
        const useing_money = ((req.body.leverage * (futures[0].price * 1500)) * (10 / 100)) * req.body.contract_number;
        //구매할때 배율 X (구매시 지수 포인트 X 1500) 의 10%가 계좌에 돈이 있어야됨
        if (user[0].money <  useing_money) {
            return { status : 400, message : "faild (Not have money)" };
        } 
        if (user[0].money >= useing_money) {
            //추매시 추매했을때 배율이 다른 계약이 들어올경우 같은 포지션이여도 다른 계약으로 취급
            const [check] = await db.query('select * from futures_user where account_id = ? AND futures_id = ? AND leverage = ? AND position = ?',
            [user[0].account_id, futures[0].futures_id, req.body.leverage, req.body.position]);
            //구매 할려는게 첫구매인가
            //yes
            if (check.length === 0) {
                await db.query('insert into futures_user values(?, ?, ?, ?, ?, ?, now())',
                [user[0].account_id, futures[0].futures_id, req.body.contract_number, futures[0].price, req.body.position, req.body.leverage]);
            }
            //no
            else {
                //추가 매수할때 돈 10%가 있는지 확인
                const New_number = (Number(check[0].contract_number) + Number(req.body.contract_number))
                const New_average = ((Number((check[0].average_price * check[0].contract_number)) + Number((futures[0].price * req.body.contract_number))) / New_number).toFixed(2);
                await db.query('update futures_user set contract_number = ?, average_price = ? where account_id = ? AND futures_id = ? AND leverage = ? AND position = ?'
                ,[New_number, New_average, user[0].account_id, futures[0].futures_id, check[0].leverage, check[0].position])
            }
        }
        else {
            return { status: 200, message: "500 i dont know" };
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
    //만약 배율이 같은 계약일 경우
    //선물 만기일은 구매일로 부터 12시간 12시간이 지나면 자동청산
    //수익금 = ((구매한 당시의 지수 포인트) - (현재 지수 포인트)) * 1500 * 배율

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
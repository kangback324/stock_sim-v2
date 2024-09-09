const isowner = require('../lib/isowner.js');
const pool = require('../lib/db.js');

exports.buy = async (req) => {
    if (await isowner(req)) {
        const db = await pool.getConnection();
        try {
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
                3.계좌에 매수금을 뺀다.
                3-1. 수수료를 발생시키고 싶을경우 판매금의 ( 미정%를 추가한 돈을 추가한뒤 뺀다.)
            */
            return { status: 200, message: "Success" };
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
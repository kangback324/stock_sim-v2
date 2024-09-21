const logWithTime = require('./logger.js')
const random = require("./random");
const pool = require('./db.js');

/*
    36번줄 중복 연산 가능성 수정 필요
    - 현재 1초 동안의 거래 내역을 모두 가져오기 때문에, 동일한 초에 여러 거래가 있을 경우 중복된 연산이 가능함.
    - 이를 해결하려면 거래 내역의 중복을 방지하거나(데이터베이스에 operationed boolean 컬럼), 각 거래에 대해 별도의 연산을 수행해야 함.
*/

async function priceUpdater() {
    // 가격 변동 적용 확률과 변동 배율 선택을 위한 랜덤 값 생성
    let applyChance = random(0, 100);
    let valueChangeSelector = random(0, 9); // valueChangeTemplates 배열에서 사용할 값을 선택
    let valueChangeTemplates = [
        '0.5', '0.6', '0.7', '0.8', '0.9', '1.1', '1.2', '1.3', '1.4', '1.5'
    ];
    const db = await pool.getConnection();
    try {
        for (let i = 0; i <= 6; i++) {
            let [results] = await db.query('SELECT * FROM stock_inform WHERE stock_id = ?', [i]);
            
            if (results.length === 0 || results[0].price === 0) continue;

            // 기본적으로 가격에 +-5%의 변동폭을 적용
            let valueChange = results[0].price * (random(95, 105) * 0.01);

            // 2% 확률로 valueChangeTemplates 배열에서 선택된 값을 가격 변동에 적용
            if (applyChance <= 1) valueChange *= valueChangeTemplates[valueChangeSelector];

            // 현재 시간을 기준으로 거래가 발생한 초의 시작과 끝을 계산
            const now = new Date();
            const startOfSecond = new Date(now.getTime() - (now.getMilliseconds() + now.getSeconds() * 1000));
            const endOfSecond = new Date(startOfSecond.getTime() + 1000); // 현재 초의 끝

            // 거래 시간 기반으로 stock_log 테이블에서 해당 초에 발생한 거래 내역을 조회
            [results] = await db.query('SELECT * FROM stock_log WHERE trading_at BETWEEN ? AND ?', [startOfSecond, endOfSecond]);

            // 거래량이 10만 주에 비례하여 1% 변동폭 증가
            // valueChange *= results .stock_number / 10000000 + 1; // 임시 주석 처리 (데이터가 비어있으면 오류 발생)

            await db.query('UPDATE stock_inform SET price = ? WHERE stock_id = ?', [valueChange, i]);
            await db.query(`insert into stock_pricelog (stock_id, price, logat) values(${i}, ${valueChange}, now())`);
        }
    } catch (err) {
        logWithTime(err);
    } finally {
        db.release();
    }
}

setInterval(priceUpdater, 3000);
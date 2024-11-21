const logWithTime = require('./logger.js')
const random = require("./random.js");
const pool = require('./db.js');

/*

*/

setInterval(async ()=> {
    function priceChange(currentPrice) {
        // 기본 변동률 (±0.5%)
        const baseVariation = random(99.9, 100.1) / 100;
        // 즘감 확률 (증가 51%)
        const direction = random(0, 100) <= 50 ? -1 : 1;
        // 최종 가격 변동
        const newPrice = currentPrice + (currentPrice * baseVariation - currentPrice) * direction;
        return newPrice;
    }
    // 변동 이벤트 (약 0.002% 확률)
    function newsEvent(currentPrice) {
        if (random(0, 100000) <= 1) {    
            const eventMultiplier = [0.775, 0.85, 0.9, 0.95, 0.975, 1.025, 1.05, 1.1, 1.15, 1.225];
            const selectedMultiplier = eventMultiplier[random(0, eventMultiplier.length - 1)];
            return currentPrice * selectedMultiplier;
        }
        return currentPrice;
    }
    
    async function stockPriceUpdater() {
        const db = await pool.getConnection();
        try {
            const [stock_count] = await db.query('SELECT * FROM stock_inform');
            
            for (let i = stock_count[0].stock_id; i < stock_count[0].stock_id + stock_count.length; i++) {
                let [results] = await db.query('SELECT * FROM stock_inform WHERE stock_id = ?', [i]);
                
                if (results.length === 0 || results[0].price === 0) continue;
                
                const currentPrice = results[0].price;
                
                // 거래량 조회 (미구현)
                
                // 가격 변동 계산
                let newPrice = priceChange(currentPrice);
                newPrice = newsEvent(newPrice);

                await db.query('UPDATE stock_inform SET price = ? WHERE stock_id = ?', [newPrice, i]);
                await db.query(`INSERT INTO stock_pricelog (stock_id, price, log_at) VALUES (?, ?, NOW())`, [i, newPrice]);
                
            }
        } catch (err) {
            logWithTime(err);
        } finally {
            db.release();
        }
    }

    await stockPriceUpdater();
}, 250);

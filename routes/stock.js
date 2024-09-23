const express = require('express');
const router = express.Router();
const StockController = require('../controllers/StockController');
const isowner = require('../lib/isowner.js')

router.use('*', async (req, res, next) =>{
    if (!await isowner(req)) {
        res.status(400).json({ message: "Need login" });
        return;
    }
});

//주식 거래
router.post('/buy', StockController.buy);
router.post('/sell', StockController.sell);

//주식 정보
router.get('/stock-inform', StockController.stock_inform);
router.get('/stock-log', StockController.stock_log); //체결 로그
router.get('/stock-pricelog', StockController.stock_pricelog); //가격변동 로그

/*

선물 기능 model 이 구현이 덜되어 임시 주석 처리함

//선물거래
router.post('/buy-futures', StockController.buy_futures); 
router.post('/sell-futures', StockController.sell_futures)

//선물 거래가능한 기초자산 정보
router.get('/futures-inform', StockController.futures_inform);
router.get('/futures-pricelog', StockController.futures_pricelog);

*/

//계좌 관련
router.get('/my-account', StockController.my_account);
router.get('/user-rank', StockController.user_rank);

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" }); // 에러 응답
});


module.exports = router;
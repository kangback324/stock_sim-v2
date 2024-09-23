const express = require('express');
const router = express.Router();
const StockController = require('../controllers/StockController');

//주식 거래
router.post('/buy', StockController.buy);
router.post('/sell', StockController.sell);

//주식 정보
router.get('/stock-inform', StockController.stock_inform);
router.get('/stock-log', StockController.stock_log); //체결 로그
router.get('/Stock-Pricelog', StockController.stock_pricelog); //가격변동 로그

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

module.exports = router;
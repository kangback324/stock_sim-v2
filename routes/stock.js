    const express = require('express');
    const router = express.Router();
    const StockController = require('../controllers/StockController');
    const FuturesController = require('../controllers/FuturesController.js');
    const authmiddleware = require('../middleware/auth.js');

    //주식 거래
    router.post('/buy', authmiddleware, StockController.buy);
    router.post('/sell', authmiddleware,  StockController.sell);

    //주식 정보
    router.get('/stock-inform/:stock_id', StockController.stock_inform);
    router.get('/stock-log/:stock_id', StockController.stock_log); //체x결 로그
    router.get('/stock-pricelog/:stock_id/:time', StockController.stock_pricelog); //가격변동 로그

    //계좌 관련
    router.get('/my-account', authmiddleware, StockController.my_account);
    router.get('/user-rank', StockController.user_rank);

    //선물거래
    // router.post('/buy-futures', authmiddleware,  FuturesController.buy_futures);
    // router.post('/sell-futures', authmiddleware, FuturesController.sell_futures)

    //선물 거래가능한 기초자산 정보 
    router.get('/futures-inform/:futures_id', FuturesController.futures_inform);
    router.get('/futures-pricelog/:futures_id', FuturesController.futures_pricelog);




    module.exports = router;
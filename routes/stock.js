    const express = require('express');
    const router = express.Router();
    const StockController = require('../controllers/StockController');
    const FuturesController = require('../controllers/FuturesController.js')
    const isowner = require('../lib/isowner.js')

    const authmiddleware = async (req, res, next) =>{
        if (!await isowner(req)) {
            res.status(400).json({ message: "Need login" });
            return;
        }
        next();
    };

    //주식 거래
    router.post('/buy', authmiddleware, StockController.buy);
    router.post('/sell', authmiddleware,  StockController.sell);

    //주식 정보
    router.get('/stock-inform', StockController.stock_inform);
    router.get('/stock-log', StockController.stock_log); //체결 로그
    router.get('/stock-pricelog', StockController.stock_pricelog); //가격변동 로그

    //선물거래
    router.post('/buy-futures', authmiddleware,  FuturesController.buy_futures);
    router.post('/sell-futures', authmiddleware, FuturesController.sell_futures)

    //선물 거래가능한 기초자산 정보 
    router.get('/futures-inform', FuturesController.futures_inform);
    router.get('/futures-pricelog', FuturesController.futures_pricelog);


    //계좌 관련
    router.get('/my-account', authmiddleware, StockController.my_account);
    router.get('/user-rank', StockController.user_rank);

    router.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ message: "Something went wrong!" }); // 에러 응답
    });


    module.exports = router;
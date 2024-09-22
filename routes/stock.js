const express = require('express');
const router = express.Router();
const StockController = require('../controllers/StockController');

router.post('/buy', StockController.buy);
router.post('/sell', StockController.sell);

router.get('/stock_inform', StockController.stock_inform);
router.get('/stock_log', StockController.stock_log); //체결 로그
router.get('/Stock_Pricelog', StockController.stock_pricelog); //가격변동 로그

router.get('/index_inform', StockController.index_inform);
router.get('/index_pricelog', StockController.index_pricelog);

router.get('/my_account', StockController.my_account);
router.get('/user_rank', StockController.user_rank);

module.exports = router;
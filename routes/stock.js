const express = require('express');
const router = express.Router();
const StockController = require('../controllers/StockController');

router.post('/Buy', StockController.buy);
router.post('/Sell', StockController.sell);

router.get('/Stock_Inform', StockController.stock);
router.get('/Stock_log', StockController.log); //체결 로그
// router.get('/Stock_Pricelog', StockController.log); //가격변동 로그

// router.get('/Index_Inform');
// router.get('/Index_Pricelog');

router.get('/My_Account', StockController.my_account);
router.get('/User_Rank', StockController.rank);

module.exports = router;
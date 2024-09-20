const express = require('express');
const router = express.Router();
const StockController = require('../controllers/StockController');

router.post('/buy', StockController.buy);
router.post('/sell', StockController.sell);
router.get('/log', StockController.log);
router.get('/my_account', StockController.my_account);
router.get('/rank', StockController.rank);

module.exports = router;
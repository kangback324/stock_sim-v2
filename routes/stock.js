const express = require('express');
const router = express.Router();
const StockController = require('../controllers/StockController');

router.post('/buy', StockController.buy);
router.post('/sell', StockController.sell);
router.post('/log', StockController.log);

module.exports = router;
const express = require('express');
const router = express.Router();
const RootController = require('../controllers/RootController');

router.get('/', RootController.home);
router.post('/login', RootController.login);
router.post('/signup', RootController.signup);

module.exports = router;

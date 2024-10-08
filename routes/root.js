const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.post('/isowner', UserController.isowner);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.post('/signup', UserController.signup);

module.exports = router;

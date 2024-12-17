const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');


/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: 유저 관련 API
 */


/**
 * @swagger
 * /my-info:
 *   get:
 *     summary: 계정 정보 반환
 *     description: 계정 정보 반환
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 200
 *                 path:
 *                   type: string
 *                   example: "/my-info"
 *                 method:
 *                   type: string
 *                   example: "GET"
 *                 data:
 *                   type: object
 *                   example: { "user_id": "1", "money" : 1000000 }
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *       400:
 *         description: 로그인이 되어있지않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 400
 *                 path:
 *                   type: string
 *                   example: "/my-info"
 *                 method:
 *                   type: string
 *                   example: "GET"
 *                 data:
 *                   type: object
 *                   example: "Need login"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 500
 *                 path:
 *                   type: string
 *                   example: "/my-info"
 *                 method:
 *                   type: string
 *                   example: "GET"
 *                 data:
 *                   type: object
 *                   example: "internet server error"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 */
router.get('/my-info', UserController.my_info);


/**
 * @swagger
 * /signup:
 *   post:
 *     summary: 회원가입
 *     description: 회원가입
 *     tags:
 *       - Users
 *     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               id:
*                 type: string
*                 description: 사용자 ID
*                 example: user123
*               pw:
*                 type: string
*                 description: 사용자 비밀번호
*                 example: password123
*               email:
*                 type: string
*                 description: 사용자 이메일
*                 example: 123@gmail.com
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 200
 *                 path:
 *                   type: string
 *                   example: "/signup"
 *                 method:
 *                   type: string
 *                   example: "POST"
 *                 data:
 *                   type: object
 *                   example: "success" 
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *       400:
 *         description: 이미 존재하는 ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 400
 *                 path:
 *                   type: string
 *                   example: "/signup"
 *                 method:
 *                   type: string
 *                   example: "POST"
 *                 data:
 *                   type: object
 *                   example: "doubleduplicate ID"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
  *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 500
 *                 path:
 *                   type: string
 *                   example: "/signup"
 *                 method:
 *                   type: string
 *                   example: "POST"
 *                 data:
 *                   type: object
 *                   example: "internet server error"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 */
router.post('/signup', UserController.signup);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 로그인
 *     description: 로그인
 *     tags:
 *       - Users
 *     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               id:
*                 type: string
*                 description: 사용자 ID
*                 example: user123
*               pw:
*                 type: string
*                 description: 사용자 비밀번호
*                 example: password123
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 200
 *                 path:
 *                   type: string
 *                   example: "/login"
 *                 method:
 *                   type: string
 *                   example: "POST"
 *                 data:
 *                   type: object
 *                   example: "success" 
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *       400:
 *         description: 잘못된 ID 또는 비밀번호호
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 200
 *                 path:
 *                   type: string
 *                   example: "/login"
 *                 method:
 *                   type: string
 *                   example: "POST"
 *                 data:
 *                   type: object
 *                   example: "not match login failed"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
  *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 500
 *                 path:
 *                   type: string
 *                   example: "/login"
 *                 method:
 *                   type: string
 *                   example: "POST"
 *                 data:
 *                   type: object
 *                   example: "internet server error"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: 로그아웃
 *     description: 로그아웃
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: 로그아웃
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: John Doe
 *       400:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 400
 *                 path:
 *                   type: string
 *                   example: "/logout"
 *                 method:
 *                   type: string
 *                   example: "GET"
 *                 data:
 *                   type: object
 *                   example: "Need login"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 500
 *                 path:
 *                   type: string
 *                   example: "/logout"
 *                 method:
 *                   type: string
 *                   example: "GET"
 *                 data:
 *                   type: object
 *                   example: "internet server error"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 */
router.post('/logout', UserController.logout);

module.exports = router;



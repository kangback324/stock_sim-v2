    const express = require('express');
    const router = express.Router();
    const StockController = require('../controllers/StockController');
    const FuturesController = require('../controllers/FuturesController.js');
    const authmiddleware = require('../middleware/auth.js');

/**
 * @swagger
 * tags:
 *   - name: Stock_user
 *     description: 유저 주식 관련 API
 */

/**
 * @swagger
 * tags:
 *    - name: stock
 *      description: 주식 관련 API
 */

   //주식 정보
/**
 * @swagger
 * /stock/stock-inform/{stock_id}:
 *   get:
 *     summary: 주식 정보 조회
 *     description: 주식 ID를 이용해 주식 정보를 조회합니다. (ID 대신 all 를 넣으면 전체 조회)
 *     tags:
 *       - stock
 *     parameters:
 *       - in: path
 *         name: stock_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 주식의 ID
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
 *                   example: "/stock/stock_inform/{stock_id}"
 *                 method:
 *                   type: string
 *                   example: "GET"
 *                 data:
 *                   type: object
 *                   example: { "stock" : [{"stock_id": 1, "name": "문경테크놀로지", "price": 87, "status": "Y", "create_at": "2024-11-22T04:17:58.000Z", "broken_at" : null}] }
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *
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
 *                   example: "/stock/stock_inform/{stock_id}"
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
   router.get('/stock-inform/:stock_id', StockController.stock_inform);


   /**
 * @swagger
 * /stock/stock-pricelog/{stock_id}/{time}:
 *   get:
 *     summary: 주식 가격변동 조회
 *     description: 주식 가격변동 조회
 *     tags:
 *       - stock
 *     parameters:
 *       - in: path
 *         name: stock_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 주식 ID
 *       - in: path
 *         name: time
 *         required: true
 *         schema:
 *           type: string
 *         description: 선택할 봉 (1 == 1분봉)
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
 *                   example: "/stock/stock_inform/{stock_id}/{time}"
 *                 method:
 *                   type: string
 *                   example: "GET"
 *                 data:
 *                   type: object
 *                   example: { "stock" : [{"stock_id": 1, "low": 32323232, "high": 3232323, "open": 3232323, "close": 21221}] }
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *
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
 *                   example: "/stock/stock_inform/{stock_id}/{time}"
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
   router.get('/stock-pricelog/:stock_id/:time', StockController.stock_pricelog); //가격변동 로그
   // router.get('/stock-log/:stock_id', StockController.stock_log); //체결 로그

   //계좌 관련
/**
 * @swagger
 * /stock/my-account:
 *   get:
 *     summary: 현재 로그인된 주식 계좌 정보 조회
 *     description: 현재 로그인된 주식 계좌 정보 조회
 *     tags:
 *       - Stock_user
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
 *                   example: "/stock/my-account"
 *                 method:
 *                   type: string
 *                   example: "GET"
 *                 data:
 *                   type: object
 *                   example: { "stock" : [{"stock_id": 1, "stock_name": "문경테크놀로지", "stock_number": 1, "nowprice": 86, "average_price": 3000}] }
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *
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
 *                   example: "/stock/my-account"
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
 *                   example: "/stock/my-account"
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
   router.get('/my-account', authmiddleware, StockController.my_account);
   
/**
 * @swagger
 * /stock/user-rank:
 *   get:
 *     summary: 전체 유저 랭킹 조회
 *     description: 전체 유저 랭킹 조회
 *     tags:
 *       - Stock_user
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
 *                   example: "/stock/user-rank"
 *                 method:
 *                   type: string
 *                   example: "GET"
 *                 data:
 *                   type: object
 *                   example: [{"user_name": "kangbaekho", "money": 1000000},{"user_name": "kangbaekho2", "money": 1000000}]
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
 *                   example: "/stock/user-rank"
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
    router.get('/user-rank', StockController.user_rank);

   //주식 거래
   /**
 * @swagger
 * /stock/buy:
 *   post:
 *     summary: 주식 구매
 *     description: 주식 구매
 *     tags:
 *       - Stock_user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock_name:
 *                 type: string
 *                 description: 주식 이름
 *                 example: "문경전자"
 *               number:
 *                 type: int
 *                 description: 수량
 *                 example: 1
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
 *                   example: "/stock/buy"
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
 *         description: 주식을 찾을수 없음
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
 *                   example: "/stock/buy"
 *                 method:
 *                   type: string
 *                   example: "POST"
 *                 data:
 *                   type: object
 *                   example: "Not found stock"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *       400-1:
 *         description: 잘못된 수량
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
 *                   example: "/stock/buy"
 *                 method:
 *                   type: string
 *                   example: "POST"
 *                 data:
 *                   type: object
 *                   example: "wrong number"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *       400-2:
 *         description: 돈이 부족함
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
 *                   example: "/stock/buy"
 *                 method:
 *                   type: string
 *                   example: "POST"
 *                 data:
 *                   type: object
 *                   example: "Not enough money"
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
 *                   example: "/stock/buy"
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
   router.post('/buy', authmiddleware, StockController.buy);
   /**
 * @swagger
 * /stock/sell:
 *   post:
 *     summary: 주식 판매
 *     description: 주식 판매
 *     tags:
 *       - Stock_user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock_name:
 *                 type: string
 *                 description: 주식 이름
 *                 example: "문경전자"
 *               number:
 *                 type: int
 *                 description: 수량
 *                 example: 1
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
 *                   example: "/stock/sell"
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
 *         description: 주식을 찾을수 없음
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
 *                   example: "/stock/sell"
 *                 method:
 *                   type: string
 *                   example: "POST"
 *                 data:
 *                   type: object
 *                   example: "Not found stock"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *       400-1:
 *         description: 잘못된 수량
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
 *                   example: "/stock/sell"
 *                 method:
 *                   type: string
 *                   example: "POST"
 *                 data:
 *                   type: object
 *                   example: "wrong number"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *       400-2:
 *         description: 보유 하고 있지 않음
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
 *                   example: "/stock/sell"
 *                 method:
 *                   type: string
 *                   example: "POST"
 *                 data:
 *                   type: object
 *                   example: "Not have"
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
 *                   example: "/stock/sell"
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
   router.post('/sell', authmiddleware,  StockController.sell);

    //선물거래
    // router.post('/buy-futures', authmiddleware,  FuturesController.buy_futures);
    // router.post('/sell-futures', authmiddleware, FuturesController.sell_futures)

    //선물 거래가능한 기초자산 정보
/**
 * @swagger
 * /stock/futures-inform/{futures_id}:
 *   get:
 *     summary: 지수 정보 조회  
 *     description: 지수 정보 조회
 *     tags:
 *       - stock
 *     parameters:
 *       - in: path
 *         name: futures_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 지수 ID
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
 *                   example: "/stock/futures-inform/{futures_id}"
 *                 method:
 *                   type: string
 *                   example: "GET"
 *                 data:
 *                   type: object
 *                   example: { "stock" : [{"futures_id": 1, "name": "  MCSPI", "price": 1500, "status": "Y", "create_at": "2024-11-22T04:17:58.000Z", "broken_at": null}] }
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *
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
 *                   example: "/stock/futures-inform/{futures_id}"
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
    router.get('/futures-inform/:futures_id', FuturesController.futures_inform);


/**
 * @swagger
 * /stock/futures-pricelog/{futures_id}:
 *   get:
 *     summary: 지수 가격변동 조회
 *     description: 지수 가격변동 조회
 *     tags:
 *       - stock
 *     parameters:
 *       - in: path
 *         name: futures_id
 *         required: true
 *         schema:
 *           type: string
 *         description: 지수 ID
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
 *                   example: "/stock/futures_price/{futures_id}"
 *                 method:
 *                   type: string
 *                   example: "GET"
 *                 data:
 *                   type: object
 *                   example: 
 *                     stock: 
 *                       - futures_id: 1
 *                         low: 32323232
 *                         high: 3232323
 *                         open: 3232323
 *                         close: 21221
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-17T16:35:21+09:00"
 *
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
 *                   example: "/stock/futures_price/{futures_id}"
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

router.get('/futures-pricelog/:futures_id', FuturesController.futures_pricelog);




    module.exports = router;
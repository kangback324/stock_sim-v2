const Stockmodel = require('../models/Stockmodel.js');
const pretty = require('../lib/prettyrespone.js');

//매수
exports.buy = async (req, res) => {
    const result = await Stockmodel.buy(req);
    pretty(result.status, req, res, result.message)
}
//매도
exports.sell = async (req, res) => {
    const result = await Stockmodel.sell(req);
    pretty(result.status, req, res, result.message)
}

//주식 조회
exports.stock_inform = async (req, res) => {
    const result = await Stockmodel.stock_inform(req);
    pretty(result.status, req, res, result.message)
}

//주식체결기록확인
exports.stock_log = async (req, res) => {
    const result = await Stockmodel.stock_log(req);
    pretty(result.status, req, res, result.message)
}

//주식 가격 변동
exports.stock_pricelog = async (req, res) => {
    if (!req.params.stock_id) {
        pretty(400, `${req.path}`,"Bad Request", res)
    }
    const result = await Stockmodel.stock_pricelog(req);
    pretty(result.status, req, res, result.message)
}

//계좌 확인
exports.my_account = async (req, res) => {
    const result = await Stockmodel.my_account(req);
    pretty(result.status, req, res, result.message)
};

//랭크
exports.user_rank = async (req, res) => {
    const result = await Stockmodel.user_rank(req);
    pretty(result.status, req, res, result.message)

}


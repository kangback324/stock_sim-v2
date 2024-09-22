const Stockmodel = require('../models/Stockmodel.js');

//매수
exports.buy = async (req, res) => {
    const result = await Stockmodel.buy(req);
    res.status(result.status).json({ message: result.message });
}
//매도
exports.sell = async (req, res) => {
    const result = await Stockmodel.sell(req);
    res.status(result.status).json({ message: result.message });
}
//주식 조회
exports.stock_inform = async (req, res) => {
    const result = await Stockmodel.stock_inform(req);
    res.status(result.status).json({ message: result.message });
}

//주식체결기록확인
exports.stock_log = async (req, res) => {
    const result = await Stockmodel.stock_log(req);
    res.status(result.status).json({ message: result.message });
}

//주식 가격 변동
exports.stock_pricelog = async (req, res) => {
    const result = await Stockmodel.stock_pricelog(req);
    res.status(result.status).json({ message: result.message });
}


exports.index_inform = async (req, res) => {
    const result = await Stockmodel.index_inform(req);
    res.status(result.status).json({ message: result.message });
}

exports.index_pricelog = async (req, res) => {
    const result = await Stockmodel.index_pricelog(req);
    res.status(result.status).json({ message: result.message });
}

//계좌 확인
exports.my_account = async (req, res) => {
    const result = await Stockmodel.my_account(req);
    res.status(result.status).json({ message: result.message });
};

//랭크
exports.user_rank = async (req, res) => {
    const result = await Stockmodel.user_rank(req);
    res.status(result.status).json({ message: result.message });
}

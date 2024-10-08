const Futuresmodel = require('../models/Futuresmodel.js');

exports.futures_inform = async (req, res) => {
    const result = await Futuresmodel.futures_inform(req);
    res.status(result.status).json({ message: result.message });
}

exports.futures_pricelog = async (req, res) => {
    if (!req.params.futures_id) {
        res.status(400).json({ message: "Bad Requset" });
    }
    const result = await Futuresmodel.futures_pricelog(req);
    res.status(result.status).json({ message: result.message });
}

exports.buy_futures = async (req, res) => {
    const result = await Futuresmodel.buy_futures(req);
    res.status(result.status).json({ message: result.message });
}

exports.sell_futures = async (req, res) => {
    const result = await Futuresmodel.sell_futures(req);
    res.status(result.status).json({ message: result.message });
}
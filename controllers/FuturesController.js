const Futuresmodel = require('../models/Futuresmodel.js');
const pretty = require('../lib/prettyrespone.js')

exports.futures_inform = async (req, res) => {
    const result = await Futuresmodel.futures_inform(req);
    pretty(result.status, req, res, result.message)
}

exports.futures_pricelog = async (req, res) => {
    if (!req.params.futures_id) {
        res.s3tatus(400).json({ message: "Bad Requset" });
    }
    const result = await Futuresmodel.futures_pricelog(req);
    pretty(result.status, req, res, result.message)
}

// exports.buy_futures = async (req, res) => {
//     const result = await Futuresmodel.buy_futures(req);
//     res.status(result.status).json({ message: result.message });
// }

// exports.sell_futures = async (req, res) => {
//     const result = await Futuresmodel.sell_futures(req);
//     res.status(result.status).json({ message: result.message });
// }
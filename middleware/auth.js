const isowner = require('../lib/isowner.js');

const authmiddleware = async (req, res, next) =>{
    if (!await isowner(req)) {
        return res.status(400).json({ message: "Need login" });
    }
    next();
};

module.exports = authmiddleware;
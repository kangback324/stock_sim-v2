const isowner = require('../lib/isowner.js');

const authmiddleware = async (req, res, next) =>{
    if (!await isowner(req)) {
        res.status(400).json({ message: "Need login" });
        return;
    }
    next();
};

module.exports = authmiddleware;
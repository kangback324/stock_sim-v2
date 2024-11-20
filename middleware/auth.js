const isowner = require('../lib/isowner.js');
const pretty = require('../lib/prettyrespone.js');

const authmiddleware = async (req, res, next) =>{
    if (!await isowner(req)) {
        return pretty(400, req, res, "Need login")
    }
    next();
};

module.exports = authmiddleware;
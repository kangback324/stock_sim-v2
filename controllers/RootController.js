const Rootmodel = require('../models/Rootmodel.js');
const isowner = require('../lib/isowner.js');

exports.home = async (req, res) => {
  const result = await isowner(req);
  res.render('index', { isowner : result });
};

exports.signup = async (req, res) => {
  const result = await Rootmodel.signup(req);
  res.status(result.status).json({ message: result.message });
}

exports.login = async (req, res) => {
  const result = await Rootmodel.login(req);
  res.status(result.status).json({ message: result.message });
};

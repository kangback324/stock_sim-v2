const Usermodel = require('../models/Usermodel.js');
const logWithTime = require('../lib/logger.js')
const isowner = require('../lib/isowner.js');

exports.home = async (req, res) => {
  const result = await isowner(req);
  res.render('index', { isowner : result });
};

exports.signup = async (req, res) => {
  const result = await Usermodel.signup(req);
  res.status(result.status).json({ message: result.message });
}

exports.isowner = async (req, res) => {
  const result = await Usermodel.isowner(req);
  res.status(result.status).json({ message: result.message });
}

exports.login = async (req, res) => {
  const result = await Usermodel.login(req);
  res.status(result.status).json({ message: result.message });
};

exports.logout = async (req, res) => {
  const result = await Usermodel.logout(req);
  res.status(result.status).json({ message: result.message });
};

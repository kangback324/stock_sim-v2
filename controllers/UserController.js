const Usermodel = require('../models/Usermodel.js');
const pretty = require('../lib/prettyrespone.js');

exports.signup = async (req, res) => {
  const result = await Usermodel.signup(req);
  pretty(result.status, req, res, result.message)
}

exports.isowner = async (req, res) => {
  const result = await Usermodel.isowner(req);
  pretty(result.status, req, res, result.message)
}

exports.login = async (req, res) => {
  const result = await Usermodel.login(req);
  pretty(result.status, req, res, result.message)
};

exports.logout = async (req, res) => {
  const result = await Usermodel.logout(req);
  pretty(result.status, req, res, result.message)
};

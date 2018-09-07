const jwt = require('jsonwebtoken');
const secretKey = require('./secretKey');
const Token = require("../models/token");

module.exports = (token) => {
	let userInfo = '';
	try{
		userInfo = jwt.verify(token, secretKey);
	}catch(err){
		console.error(err);
	}

	return Token.findOne({userId: userInfo.id}).then(data=>{
		return data.token == token ? userInfo : null;
	})
}
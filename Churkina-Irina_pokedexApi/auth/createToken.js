const jwt = require('jsonwebtoken');
const secretKey = require('./secretKey');

function createToken(payload){
	return jwt.sign(payload, secretKey);
}

module.exports = createToken;
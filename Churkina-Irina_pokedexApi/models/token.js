const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  token: {
    type: String
  },
  userId: {
	type: String,
    unique: true,
    required: true
  }
});

const Token = mongoose.model('token', tokenSchema);

module.exports = Token;

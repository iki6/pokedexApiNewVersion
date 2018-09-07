const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pokemonSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field is required"]
  },
  id: {
    type: Number,
    required: [true, "ID field is required"]
  }
});


const Pokemon = mongoose.model('pokemon', pokemonSchema);

module.exports = Pokemon;
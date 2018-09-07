const vars = require('dotenv').config();
const mongoose = require("mongoose");
const futureData = require('../data/pokemons.json');
const Pokemon = require('../models/pokemon');

console.log(`${process.env.DB_HOST || 'localhost'}      ${process.env.DB_PORT || '27017'}      `)

mongoose.connect(`mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/pokemonsList`, {
	useNewUrlParser: true
})
	.then(()=>{console.log('connected to DB')})
	.then(()=>{Pokemon.collection ? Pokemon.collection.drop() : ''})
	.then(()=>{
		console.log('Collection has been deleted');
		Pokemon.insertMany(futureData.pokemons)
		.then(()=>{
			console.log('Data has been loaded');
			process.exit(0);
		})
		.catch(err => console.error(err));
	})
	.catch(err => console.error(err));
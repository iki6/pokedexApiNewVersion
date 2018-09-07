const vars = require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes/index");

const PORT = process.env.PORT || 3000;
const HOST = process.env.DB_HOST || 'localhost';

const app = express();

mongoose.connect(`mongodb://${HOST}/pokemonsList`,{ useNewUrlParser: true });
mongoose.Promise = global.Promise;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
	bodyParser.json()
  );

app.use("/api", routes);

app.listen(PORT, function() {
  console.log("listening for reqests");
});


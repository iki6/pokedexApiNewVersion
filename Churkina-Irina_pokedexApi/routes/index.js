const express = require("express");
const router = express.Router();
const Pokemon = require("../models/pokemon");
const User = require("../models/user");
const Token = require("../models/token");
const bcrypt = require("bcryptjs");
const createToken = require("../auth/createToken");
const defineUserByToken = require("../auth/defineUserByToken");
const createPagination = require("../helpers/pagination");

router.get("/pokemons", function(req, res, next) {
  const limit = parseInt(req.query.limit ? req.query.limit : 20);
  const page = parseInt(req.query.page);

  Pokemon.find({})
    .then(pokemons => {
      let result = createPagination(pokemons, limit, page);
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send();
    });
});

router.post("/pokemons", function(req, res, next) {
  let pokemon = new Pokemon(req.body);
  pokemon
    .save()
    .then(data => {
      res.send(pokemon);
    })
    .catch(next);
});

router.put("/pokemons/:id", function(req, res, next) {
  Pokemon.findByIdAndUpdate({ id: req.params.id }, req.body).then(data => {
    Pokemon.findOne({ id: req.params.id }).then(pokemon => {
      res.send(pokemon);
    });
  });
});

router.delete("/pokemons/:id", function(req, res, next) {
  Pokemon.findOneAndRemove({ id: req.params.id }).then(pokemon => {
    res.send(pokemon);
  });
  res.send({ type: "DELETE" });
});

router.post("/newUser", function(req, res, next) {
  let user = new User({
    username: req.body.name,
    password: bcrypt.hashSync(req.body.password)
  });

  User.findOne({ username: user.username })
    .then(user => {
      res.status(403).send(`User '${user.username}' already exists`);
    })
    .catch(err => {
      console.log(err);
    });

  user
    .save()
    .then(data => {
      Token.create({
        userId: data._id
      })
        .then(() => {
          res.status(200).send({ userCreated: true });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

router.post("/login", function(req, res, next) {
  User.findOne({ username: req.body.name })
    .then(data => {
      if (bcrypt.compareSync(req.body.password, data.password)) {
        let userToken = createToken({ id: data._id });
        Token.findOneAndUpdate({ userId: data._id }, { token: userToken })
          .then(data => {
            console.log("Token successfully created");
          })
          .catch(err => {
            console.log(err);
          });
        res.status(200).send({ token: userToken });
      } else {
        res.status(403).send("Invalid password");
      }
    })
    .catch(err => {
      res.send("Authentification failed");
    });
});

router.get("/caughtPokemons", function(req, res, next) {
  const limit = parseInt(req.query.limit ? req.query.limit : 20);
  const page = parseInt(req.query.page);

  const user = defineUserByToken(req.headers.token);

  user.then(data => {
    if (data == null) {
      res
        .status(403)
        .send("Cannot provide caught pokemons list. Log in first.");
    } else {
      User.findOne({ _id: data.id })
        .then(user => {
          !user.caughtPokemons.length ? res.send([]) : "";

          Pokemon.find({
            id: { $in: user.caughtPokemons }
          })
            .then(data => {
              let paginatedResult = createPagination(data, limit, page);
              res.send(paginatedResult);
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          res.status(404).send();
        });
    }
  });
});

router.get("/catchPokemon/:id", function(req, res, next) {
  const user = defineUserByToken(req.headers.token);

  user.then(data => {
    if (data == null) {
      res
        .status(403)
        .send("Cannot provide caught pokemons list. Log in first.");
    } else {
      User.findOne({ _id: data.id })
        .then(user => {
          if (!user.caughtPokemons.includes(req.params.id)) {
            user.caughtPokemons.push(req.params.id);
            user.save();
            Pokemon.findOne({ id: req.params.id }).then(data => {
              res.send(data);
            });
          } else {
            res.status(403).send("You already have this one");
          }
        })
        .catch(err => {
          res.status(404).send();
        });
    }
  });
});

router.get("/releaseAll", function(req, res, next) {
  const user = defineUserByToken(req.headers.token);

  user.then(data => {
    if (data == null) {
      res
        .status(403)
        .send("Cannot provide caught pokemons list. Log in first.");
    } else {
      User.findOne({ _id: data.id })
        .then(user => {
          user.caughtPokemons = [];
          user.save();
          res.send(user.caughtPokemons);
        })
        .catch(err => {
          res.status(404).send();
        });
    }
  });
});

module.exports = router;

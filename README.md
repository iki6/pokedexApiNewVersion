## Pokedex API (node.js)
------------------------

*Set Environment Variables first*

*Usage:*
(in examples below DB_HOST is `localhost`, PORT is `3000` and DB_PORT is `27017`)
api has 'dotenv' in package.json dependencies, so, you can create file '.env' and put this variables in there

* Reinit pokemons collection(using command from package.json file):
   `npm run reinitDB`

* Get pokemons list(get):
   `http://localhost:3000/api/pokemons`

* Get certain page of pokemons list(get):
   `http://localhost:3000/api/pokemons?page=5`

* You can also specify page limit(default 20):
   `http://localhost:3000/api/pokemons?page=5&limit=10`

* Sign in with(post):
   `http://localhost:3000/api/newUser`
   put user info into request body:
   `{
     "name":"newUser",
     "password":"password"
   }`

* Log in(post):
   `http://localhost:3000/api/login`
   put user's name and password as well as while signing in

*You will receive a token after loging in - copy it and send in headers of your requests(token=your_token); token from last logging in is invalid after this step*
*If you signed in, you need to log in anyway*

*Next steps for logged in users only*

* Catch a pokemon(get):
   `http://localhost:3000/api/catchPokemon/25`

* Get caught pokemons list(get):
   `http://localhost:3000/api/caughtPokemons`

* Use pagination for caught pokemons:
   `http://localhost:3000/api/caughtPokemons?page=5&limit=10`

* Clear caught pokemons list(get):
   `http://localhost:3000/api/releaseAll`


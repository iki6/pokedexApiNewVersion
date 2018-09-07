const Pokemon = require('../models/pokemon');

module.exports = function(p, resultArray) {
  return Pokemon.findOne({ id: p }).then(data => {
    console.log(index);
    resultArray.push(data);
  });
};

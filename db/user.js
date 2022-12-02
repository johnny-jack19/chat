const knex = require("./knex");

function addUser(user) {
  return knex("user").insert(user);
}

module.exports = { addUser };

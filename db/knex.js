const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: process.env.HOST_NAME,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DB_NAME,
  },
});

module.exports = knex;

const knex = require("./knex");

function pullChat() {
  return knex("chat_1_2").select("*");
}

function makeTable() {
  return knex.schema.createTable("chat_1_2", function (table) {
    table.increments("message_id").primary();
    table.integer("user_id");
    table.string("message");
    table.timestamp("time_stamp").defaultTo(knex.fn.now());
  });
}

function addMessage(table, message) {
  return knex(table).insert(message);
}

module.exports = { pullChat, makeTable, addMessage };

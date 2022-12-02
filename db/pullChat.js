const knex = require("./knex");
const bcrypt = require("bcrypt");

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

function addUser(user) {
  return knex("user").insert(user);
}

async function login(user) {
  const userData = await checkUser(user);
  return await bcrypt.compare(user.pass, userData[0].pass);
}

function checkUser(user) {
  return knex("user").where("user_name", user["user_name"]);
}

module.exports = { pullChat, makeTable, addMessage, addUser, login };

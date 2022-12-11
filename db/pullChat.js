const knex = require("./knex");

//Pulls chat table
async function pullChat(user, friend) {
  const tableData = sortUser(user, friend);
  const table = `chat_${tableData[0]}_${tableData[1]}`;
  const doesTableExist = await tableExists(table);
  if (!doesTableExist) {
    await makeTable(table);
  }
  return knex(table).select("*");
}

//Creates new chat table if one doesn't exist
function makeTable(newTable) {
  return knex.schema.createTable(newTable, function (table) {
    table.increments("message_id").primary();
    table.integer("user_id");
    table.string("message");
    table.timestamp("time_stamp").defaultTo(knex.fn.now());
  });
}

//Adds message to chat table
async function addMessage(user, friend, message) {
  const tableData = sortUser(user, friend);
  const table = `chat_${tableData[0]}_${tableData[1]}`;
  const doesTableExist = await tableExists(table);
  if (!doesTableExist) {
    await makeTable(table);
  }
  return knex(table).insert(message);
}

//Helper to sort incoming params
function sortUser(user, friend) {
  let first;
  let second;
  if (parseInt(user) < parseInt(friend)) {
    first = user;
    second = friend;
  } else {
    first = friend;
    second = user;
  }
  return [first, second];
}

//Helper for messages/tables
function tableExists(table) {
  return knex.schema.hasTable(table);
}

//Returns a list of users that doesn't include the person who called it
function userList(userId) {
  return knex("user")
    .select("user_name", "user_id")
    .whereNot("user_id", userId)
    .orderBy("user_name");
}

module.exports = { pullChat, addMessage, userList };

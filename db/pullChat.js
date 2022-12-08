const knex = require("./knex");

async function pullChat(user, friend) {
  const tableData = sortUser(user, friend);
  const table = `chat_${tableData[0]}_${tableData[1]}`;
  const doesTableExist = await tableExists(table);
  if (!doesTableExist) {
    await makeTable(table);
  }
  return knex(table).select("*");
}

function makeTable(newTable) {
  return knex.schema.createTable(newTable, function (table) {
    table.increments("message_id").primary();
    table.integer("user_id");
    table.string("message");
    table.timestamp("time_stamp").defaultTo(knex.fn.now());
  });
}

async function addMessage(user, friend, message) {
  const tableData = sortUser(user, friend);
  const table = `chat_${tableData[0]}_${tableData[1]}`;
  const doesTableExist = await tableExists(table);
  if (!doesTableExist) {
    await makeTable(table);
  }
  return knex(table).insert(message);
}

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

function tableExists(table) {
  return knex.schema.hasTable(table);
}

function userList(userId) {
  return knex("user")
    .select("user_name", "user_id")
    .whereNot("user_id", userId);
}

module.exports = { pullChat, addMessage, userList };

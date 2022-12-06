const knex = require("./knex");
const bcrypt = require("bcrypt");

//Resgisters New User
function addUser(user) {
  return knex("user").insert(user);
}

//Login as a whole
async function login(user) {
  const userInfo = await checkUser(user);
  if (userInfo.length === 0) {
    return ["No user with that name"];
  }
  try {
    if (await bcrypt.compare(user.pass, userInfo[0].pass)) {
      const resetSessionNeeded = await sessionData(userInfo[0]["user_id"]);
      if (resetSessionNeeded.length > 0) {
        await deleteSession(userInfo[0]["user_id"]);
      }
      await addSession(userInfo[0]["user_id"]);
      return await sessionData(userInfo[0]["user_id"]);
    } else {
      return ["Incorrect password"];
    }
  } catch (err) {
    return ["Error"];
  }
}

//Login helpers------------------------------------------------------
//Checks for user
function checkUser(user) {
  return knex("user").where("user_name", user["user_name"]);
}

//Adds session data to 'sessions' table
function addSession(user_id) {
  return knex.raw(
    "INSERT INTO sessions (user_id, session_id) VALUES (" +
      user_id +
      ", uuid());"
  );
}

//Used to make cookies and check for existing sessions of user
function sessionData(user_id) {
  return knex("sessions").where("user_id", user_id);
}

//Deletes session
function deleteSession(user_id) {
  return knex("sessions").where("user_id", user_id).del();
}

module.exports = { addUser, login, addSession, sessionData };

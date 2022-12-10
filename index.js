const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const db = require("./db/pullChat");
const auth = require("./db/auth");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Gets user list
app.get("/userlist", checkUserCall, async (req, res) => {
  const results = await db.userList(req.headers["user"]);
  res.status(200).json({ results });
});

//Pull chat from table
app.get("/:user/:friend", checkSession, async (req, res) => {
  const results = await db.pullChat(req.params.user, req.params.friend);
  res.status(200).json({ results });
});

//Add message
app.post("/message/:user/:friend", checkSession, async (req, res) => {
  const results = await db.addMessage(
    req.params.user,
    req.params.friend,
    req.body
  );
  res.status(201).json({ results });
});

//Add user
app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.pass, 10);
    const results = await auth.addUser({
      user_name: req.body.userName.toUpperCase(),
      pass: hashedPassword,
    });
    if (results === "Invalid") {
      res.status(401).send();
    } else {
      res.status(201).send(results);
    }
  } catch {
    res.status(500).send();
  }
});

//Login
app.post("/users/login", async (req, res) => {
  try {
    const results = await auth.login({
      user_name: req.body.userName.toUpperCase(),
      pass: req.body.pass,
    });
    if (results[0] === "No user with that name") {
      res.status(401).send("Incorrect user name");
    } else if (results[0] === "Incorrect password") {
      res.status(401).send("Incorrect password");
    } else if (results[0] === "Error") {
      res.status(500).send("Error");
    } else {
      res.status(200).send({
        user: results[0]["user_id"],
        session: results[0]["session_id"],
      });
    }
  } catch {
    res.status(500).send();
  }
});

//Middleware that checks if logged in
async function checkSession(req, res, next) {
  const authSession = {
    user: req.headers["user"],
    session: req.headers["session"],
  };
  if (authSession.user === "null" || authSession.session === "null") {
    res.status(401).send();
    return;
  }
  if (authSession.user != req.params.user) {
    res.status(401).send();
    return;
  }
  const sessionInfo = await auth.sessionData(authSession.user);
  if (sessionInfo.length === 0) {
    res.status(401).send();
  } else if (sessionInfo[0]["session_id"] === authSession.session) {
    next();
  } else {
    res.status(500).send("Error");
  }
}

async function checkUserCall(req, res, next) {
  const authSession = {
    user: req.headers["user"],
    session: req.headers["session"],
  };
  if (authSession.user === "null" || authSession.session === "null") {
    res.status(401).send();
    return;
  }
  const sessionInfo = await auth.sessionData(authSession.user);
  if (sessionInfo.length === 0) {
    res.status(401).send();
  } else if (sessionInfo[0]["session_id"] === authSession.session) {
    next();
  } else {
    res.status(500).send("Error");
  }
}

app.listen(PORT, () => {
  console.log(process.env.USER_NAME);
  console.log("Server is running on Port " + PORT);
});

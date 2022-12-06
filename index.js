const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./db/pullChat");
const auth = require("./db/auth");

const app = express();
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Test
app.get("/sample", checkCookie, async (req, res) => {
  const results = await db.pullChat();
  res.status(200).json({ results });
});

app.post("/test", async (req, res) => {
  const results = await db.makeTable();
  res.status(201).json({ results });
});

app.post("/message/:table", async (req, res) => {
  const results = await db.addMessage(req.params.table, req.body);
  res.status(201).json({ results });
});

//Users
app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.pass, 10);
    const results = await auth.addUser({
      user_name: req.body.userName,
      pass: hashedPassword,
    });
    res.status(201).send(results);
  } catch {
    res.status(500).send();
  }
});

// app.post("/session", async (req, res) => {
//   try {
//     const results = await auth.addSession(52);
//     const cookieInfo = await auth.cookieData(52);
//     res.status(201).send(cookieInfo);
//   } catch {
//     res.status(500).send();
//   }
// });

app.post("/users/login", async (req, res) => {
  try {
    const results = await auth.login({
      user_name: req.body.userName,
      pass: req.body.pass,
    });
    if (results[0] === "No user with that name") {
      res.status(401).send("Incorrect user name");
    } else if (results[0] === "Incorrect password") {
      res.status(401).send("Incorrect password");
    } else if (results[0] === "Error") {
      res.status(500).send("Error");
    } else {
      res.cookie("user", results[0]["user_id"]);
      res.cookie("session", results[0]["session_id"]);
      res.send("Cookies are set");
    }
  } catch {
    res.status(500).send();
  }
});

async function checkCookie(req, res, next) {
  const authCookies = await req.cookies;
  if (!authCookies.user || !authCookies.session) {
    res.status(401).send("Please sign in");
    return;
  }
  const sessionInfo = await auth.sessionData(authCookies.user);
  if (sessionInfo.length === 0) {
    res.status(401).send("Please sign in");
  } else if (sessionInfo[0]["session_id"] === authCookies.session) {
    next();
  } else {
    res.status(500).send("Error");
  }
}

app.listen(PORT, () => {
  console.log("Server is running on Port " + PORT);
});

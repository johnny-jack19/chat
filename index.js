const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const db = require("./db/pullChat");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Test
app.get("/sample", async (req, res) => {
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
    const results = await db.addUser({
      user_name: req.body.userName,
      pass: hashedPassword,
    });
    res.status(201).send(results);
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const results = await db.login({
    user_name: req.body.userName,
    pass: req.body.pass,
  });
  if (results) {
    res.status(200).send("Success");
  } else {
    res.status(500).send("Failure");
  }
});

app.listen(PORT, () => {
  console.log("Server is running on Port " + PORT);
});

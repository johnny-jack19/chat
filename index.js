const express = require("express");
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

app.listen(PORT, () => {
  console.log("Server is running on Port " + PORT);
});

import express from "express";
import database from "./database.js";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

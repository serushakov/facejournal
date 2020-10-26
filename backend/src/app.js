import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import session from "express-session";

import "./passport";

const app = express();

app.use(bodyParser.json());
app.use(
  session({
    secret: "very secret", // TODO: FIX
  })
);

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/login", passport.authenticate("local"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

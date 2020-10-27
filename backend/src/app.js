import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import session from "express-session";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

import "./passport";
import { User } from "./database";

const app = express();

app.use(bodyParser.json());
app.use(
  session({
    secret: "very secret", // TODO: FIX
  })
);
app.use(passport.initialize());
app.use(passport.session());

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/login", passport.authenticate("local"));

app.post("/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  console.log(email, password, first_name, last_name);

  if (!email || !password || !first_name || !last_name) {
    return res.send(400);
  }

  const existingUser = await User.findOne({
    where: {
      email: {
        [Op.eq]: email,
      },
    },
  });

  if (existingUser) {
    return res.send(400);
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  console.log(encryptedPassword);

  await User.create({
    firstName: first_name,
    lastName: last_name,
    email,
    password: encryptedPassword,
  });

  req.login(user, () => {
    return res.send(200);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

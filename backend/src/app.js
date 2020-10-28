import express from "express";
import passport from "passport";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

import "./passport";
import { Friendship, User } from "./database";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
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

app.post("/login", passport.authenticate("local"), (_, res) => res.send(200));

app.post("/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

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

  const user = await User.create({
    firstName: first_name,
    lastName: last_name,
    email,
    password: encryptedPassword,
  });

  req.login(user, () => {
    console.log(user);
    return res.send(200);
  });
});

app.get("/users", async (req, res) => {
  const users = await User.findAll({
    attributes: ["firstName", "lastName", "id"],
    include: {
      model: User,
      as: "friends",
      attributes: ["firstName", "lastName", "id"],
    },
  });

  res.json(users);
});

app.post("/friend", async (req, res) => {
  if (!req.isAuthenticated()) return res.send(401);

  const userId = req.body.userId;

  if (!userId) {
    return res.send(400);
  }

  Friendship.create({
    friendId: userId,
    UserId: req.user.id,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

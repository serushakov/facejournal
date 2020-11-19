import express, { response } from "express";
import passport from "passport";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

import "./passport";
import { Friendship, User } from "./database";

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  const user = await User.findOne({
    where: {
      email: {
        [Op.eq]: email,
      },
    },
  });

  if (!user) {
    res.status = 401;
    return res.send({
      message: "Either email or password are incorrect",
    });
  }

  const passwordCorrect = await bcrypt.compare(password, user.password);

  if (!passwordCorrect) {
    res.status = 401;
    return res.send({
      message: "Either email or password are incorrect",
    });
  }

  const { firstName, lastName, id } = user;

  const token = jwt.sign({ firstName, lastName, id, email }, "very secret", {
    expiresIn: 86400,
  });

  res.send({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      email: user.email,
    },
    token,
  });
});

app.post("/register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  if (!email || !password || !first_name || !last_name) {
    return res.status(400).send("Some of the fields are missing");
  }

  const existingUser = await User.findOne({
    where: {
      email: {
        [Op.eq]: email,
      },
    },
  });

  if (existingUser) {
    return res.status(400).send("User already exists");
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName: first_name,
    lastName: last_name,
    email,
    password: encryptedPassword,
  });

  const token = jwt.sign({ firstName, lastName, id, email }, "very secret", {
    expiresIn: 86400,
  });

  req.login(user, () => {
    return res.send(user);
  });
});

app.use(passport.authenticate("jwt"));
app.get("/me", (req, res) => {
  if (!req.isAuthenticated()) return res.send(401);

  res.send(req.user);
});

app.get("/users", async (req, res) => {
  const users = await User.findAll({
    attributes: ["firstName", "lastName", "id", "email"],
    include: {
      model: User,
      as: "friends",
      attributes: ["firstName", "lastName", "id", "email"],
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

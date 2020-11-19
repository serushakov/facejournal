import { Op } from "sequelize";
import { body, validationResult } from "express-validator";
import { User } from "../../database";
import { serializeUserAuth } from "./serializers";
import { createUser, createUserJwt } from "./utils";

export const registerValidators = [
  body("email").isEmail().exists(),
  body("password").exists(),
  body("first_name").exists(),
  body("last_name").exists(),
];

async function handleRegister(req, res) {
  const { email, password, first_name, last_name } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.send(errors.array());
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

  const user = await createUser({
    email,
    password,
    firstName: first_name,
    lastName: last_name,
  });
  const token = createUserJwt(user);

  res.send(serializeUserAuth(user, token));
}

export default handleRegister;

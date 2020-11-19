import { Op } from "sequelize";
import { User } from "../../database";
import { serializeUserAuth } from "./serializers";
import { createUser, createUserJwt } from "./utils";

async function handleRegister(req, res) {
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

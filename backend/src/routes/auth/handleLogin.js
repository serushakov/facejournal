import bcrypt from "bcrypt";
import { User } from "../../database";
import { serializeUserAuth } from "./serializers";
import { createUserJwt } from "./utils";
import { Op } from "sequelize";

async function handleLogin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: {
        [Op.eq]: email,
      },
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status = 400;
    return res.send({
      message: "Either email or password are incorrect",
    });
  }

  const token = createUserJwt(user);

  res.send(serializeUserAuth(user, token));
}

export default handleLogin;

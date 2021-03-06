import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { User } from '../../database';
import { createUserJwt } from './utils';

export const loginValidators = [
  body('email').isEmail().exists(),
  body('password').exists(),
];

async function handleLogin(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return res.send(errors.array());
  }

  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: {
        [Op.eq]: email,
      },
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send([
      {
        msg: 'Either email or password are incorrect',
      },
    ]);
  }

  const token = createUserJwt(user);

  res.send({
    user: await user.toMeJson(),
    token,
  });
}

export default handleLogin;

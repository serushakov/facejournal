import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../database';

const TOKEN_EXPIRATION = 86400; // 24 hours

export function createUserJwt({ firstName, lastName, id, email }) {
  // FIXME secret
  const token = jwt.sign({ firstName, lastName, id, email }, 'very secret', {
    expiresIn: TOKEN_EXPIRATION,
  });

  return token;
}

export async function createUser({ password, ...rest }) {
  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    password: encryptedPassword,
    ...rest,
  });

  return user;
}

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../../database";

const TOKEN_EXPIRATION = 86400; // 24 hours

export function createUserJwt({ firstName, lastName, id, email }) {
  // FIXME secret
  const token = jwt.sign({ firstName, lastName, id, email }, "very secret", {
    expiresIn: 86400,
  });

  return token;
}

export async function createUser({ email, firstName, lastName, password }) {
  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: encryptedPassword,
  });

  return user;
}

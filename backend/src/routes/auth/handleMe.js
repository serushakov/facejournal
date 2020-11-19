import { header, validationResult } from "express-validator";
import { serializeUser } from "./serializers.js";

export const meValidators = [header("Authorization").exists()];

function handleMe(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.send(errors.array());
  }

  if (!req.isAuthenticated()) {
    res.status(401);
    return res.send([{ msg: "Unauthorized" }]);
  }

  res.send(serializeUser(req.user));
}

export default handleMe;

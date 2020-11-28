import { header, validationResult } from 'express-validator';

export const meValidators = [header('Authorization').exists()];

async function handleMe(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.send(errors.array());
  }

  if (!req.isAuthenticated()) {
    res.status(401);
    return res.send([{ msg: 'Unauthorized' }]);
  }

  res.send(await req.user.toJSON());
}

export default handleMe;

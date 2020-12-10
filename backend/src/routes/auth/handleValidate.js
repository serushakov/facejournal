import { body, validationResult } from 'express-validator';
import { User } from '../../database';

export const validateValidators = [body('email').isEmail()];

const handleValidate = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.send(errors.array());
  }

  const count = await User.count({ where: { email: req.body.email } });

  if (count === 0) {
    return res.sendStatus(200);
  }

  return res.status(400).send([{ msg: 'Email exists' }]);
};

export default handleValidate;

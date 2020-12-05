import { query, validationResult } from 'express-validator';
import { Sequelize } from 'sequelize';
import { User } from '../../database';

const defaults = {
  limit: 25,
  offset: 0,
};

export const searchValidators = [
  query('q'),
  query('limit').isNumeric().optional(),
  query('offset').isNumeric().optional(),
];

const handleSearch = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.send(errors.array());
  }

  const { q, limit = defaults.limit, offset = defaults.offset } = req.query;

  const searchConfig = q
    ? {
        where: Sequelize.literal(
          `MATCH (firstName, lastName, email) AGAINST('${q}' IN NATURAL LANGUAGE MODE)`
        ),
      }
    : undefined;

  const users = await User.findAndCountAll({
    limit,
    offset,
    ...searchConfig,
  });

  const { count, rows } = users;

  res.send({
    limit,
    offset,
    count,
    rows: await Promise.all(rows.map((user) => user.toJSON())),
  });
};

export default handleSearch;

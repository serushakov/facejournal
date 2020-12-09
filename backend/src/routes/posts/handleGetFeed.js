import { query, validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Post } from '../../database';

const extractQueryParamsForSequelize = ({ query: { limit, offset } }) => {
  const parsedLimit = parseInt(limit);
  const parsedOffset = parseInt(offset);

  return {
    limit: Number.isNaN(parsedLimit) ? 25 : parsedLimit,
    offset: Number.isNaN(parsedOffset) ? 0 : parsedOffset,
  };
};

export const getFeedValidators = [
  query('limit').isNumeric().optional(),
  query('offset').isNumeric().optional(),
];

async function handleGetFeed(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }

  const { user } = req;

  const friends = await user.getFriends();
  const userIds = [...friends.map((friend) => friend.id), user.id];

  const { limit, offset } = extractQueryParamsForSequelize(req);

  const posts = await Post.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    where: {
      creatorId: {
        [Op.in]: userIds,
      },
    },
  });

  const { count, rows } = posts;

  res.send({
    limit,
    offset,
    count,
    rows: await Promise.all(rows.map((post) => post.toJSON(user))),
  });
}

export default handleGetFeed;

import sequelize, { initialize } from './sequelize';
import User, { Friendship } from './User';
import Post from './Post';

(async () => {
  await initialize();
  sequelize.sync();
})();

export { sequelize, User, Friendship, Post };

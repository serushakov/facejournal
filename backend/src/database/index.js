import sequelize, { initialize } from './sequelize';
import User, { Friendship } from './User';
import Post from './Post';
import Media from './Media';

(async () => {
  await initialize();
  sequelize.sync();
})();

export { sequelize, User, Friendship, Post, Media };

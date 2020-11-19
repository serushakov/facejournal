import sequelize, { initialize } from './sequelize';
import User, { Friendship } from './User';
import Post from './Post';

(async () => {
  await initialize();
  await User.sync();
  await Friendship.sync();
  await Post.sync();
})();

export { sequelize, User, Friendship, Post };

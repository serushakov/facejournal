import sequelize, { initialize } from './sequelize';
import User, { Friendship } from './User';
import Post from './Post';
import Media from './Media';
import Like from './Like';
import Role from './Role';
import Permission from './Permission';

import './associations';

(async () => {
  await initialize();
  sequelize.sync();
})();

export { sequelize, User, Friendship, Post, Media, Role, Like, Permission };

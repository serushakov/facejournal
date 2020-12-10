import Permission from './Permission';
import Role from './Role';
import User from './User';
import Post from './Post';
import Media from './Media';
import Like from './Like';

Role.belongsToMany(Permission, { through: 'RolePermission' });
Permission.belongsToMany(Role, { through: 'RolePermission' });

User.belongsToMany(User, {
  through: 'Follower',
  as: 'subscriptions',
  foreignKey: 'followerId',
});

User.belongsToMany(User, {
  through: 'Follower',
  as: 'followers',
  foreignKey: 'victimId',
});

User.belongsTo(Role, {
  foreignKey: {
    name: 'role',
    allowNull: false,
    defaultValue: 'user',
  },
});

User.hasMany(Post, { foreignKey: 'creatorId' });
Post.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

Post.hasMany(Media, {
  foreignKey: 'postId',
  as: 'media',
});

Post.hasMany(Like, {
  foreignKey: 'postId',
});

Like.belongsTo(User, {
  foreignKey: 'userId',
});

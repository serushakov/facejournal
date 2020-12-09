import Permission from './Permission';
import Role from './Role';
import User from './User';
import Post from './Post';
import Media from './Media';
import Like from './Like';

Role.belongsToMany(Permission, { through: 'RolePermission' });
Permission.belongsToMany(Role, { through: 'RolePermission' });

User.belongsToMany(User, {
  through: 'Friendship',
  as: 'friendRequests',
  foreignKey: 'friendId',
});
User.belongsToMany(User, {
  through: 'Friendship',
  as: 'friends',
  foreignKey: 'userId',
});

User.belongsTo(Role, {
  foreignKey: {
    name: 'role',
    allowNull: false,
    defaultValue: 'user',
  },
});

User.hasMany(Post, { foreignKey: 'creatorId' });
Post.belongsTo(User, { foreignKey: 'creatorId' });

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

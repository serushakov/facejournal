import { DataTypes } from 'sequelize';
import sequelize from './sequelize';
import User from './User';

const roles = ['admin', 'moderator', 'user'];

const permissions = ['user.delete', 'post.delete', 'post.update'];

const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
    validate: {
      isIn: [roles],
    },
  },
});

const Permission = sequelize.define('Permission', {
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
    validate: {
      isIn: [permissions],
    },
  },
});

Role.belongsToMany(Permission, { through: 'RolePermission' });
Permission.belongsToMany(Role, { through: 'RolePermission' });

User.belongsTo(Role, {
  foreignKey: {
    name: 'role',
    allowNull: false,
    defaultValue: 'user',
  },
});

export default Role;

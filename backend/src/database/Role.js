import { DataTypes } from 'sequelize';
import sequelize from './sequelize';

const roles = ['admin', 'moderator', 'user'];

const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
    validate: {
      isIn: [roles],
    },
  },
});

export default Role;

import { DataTypes } from 'sequelize';
import sequelize from './sequelize';

const permissions = ['user.delete', 'post.delete', 'post.update'];

const Permission = sequelize.define('Permission', {
  name: {
    type: DataTypes.STRING,
    primaryKey: true,
    validate: {
      isIn: [permissions],
    },
  },
});

export default Permission;

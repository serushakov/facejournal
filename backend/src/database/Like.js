import { DataTypes } from 'sequelize';
import sequelize from './sequelize';
import User from './User';

const Like = sequelize.define('Like', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
});

Like.belongsTo(User, {
  foreignKey: 'userId',
});

export default Like;

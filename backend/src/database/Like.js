import { DataTypes } from 'sequelize';
import sequelize from './sequelize';
import User from './User';

const Like = sequelize.define('Like', {
  userId: {
    type: DataTypes.UUID,
    unique: 'likeId',
    primaryKey: true,
    allowNull: false,
  },
  postId: {
    type: DataTypes.UUID,
    unique: 'likeId',
    primaryKey: true,
    allowNull: false,
  },
});

Like.belongsTo(User, {
  foreignKey: 'userId',
});

export default Like;

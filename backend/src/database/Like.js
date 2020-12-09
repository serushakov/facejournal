import { DataTypes } from 'sequelize';
import sequelize from './sequelize';

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

export default Like;

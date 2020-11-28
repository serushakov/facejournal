import { DataTypes } from 'sequelize';
import sequelize from './sequelize';
import User from './User';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  videoUrl: {
    type: DataTypes.STRING,
  },
  textContent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Post.belongsTo(User, {
  foreignKey: 'creator',
});

export default Post;

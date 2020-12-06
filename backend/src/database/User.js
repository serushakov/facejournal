import { DataTypes } from 'sequelize';
import sequelize from './sequelize';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/static/images/user-avatar-placeholder.jpg',
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/static/images/user-cover-image-placeholder.jpg',
    },
  },
  {
    indexes: [
      {
        name: 'search_index',
        type: 'FULLTEXT',
        fields: ['firstName', 'lastName', 'email'],
      },
    ],
  }
);

export const Friendship = sequelize.define('Friendship', {
  friendId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: User,
    },
  },
});

User.belongsToMany(User, { as: 'friends', through: Friendship });

User.prototype.toJSON = async function toJSON() {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    id: this.id,
    email: this.email,
    avatar: this.avatar,
    coverImage: this.coverImage,
    createdAt: this.createdAt,
  };
};

export default User;

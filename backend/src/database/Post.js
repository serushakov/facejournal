import { DataTypes } from 'sequelize';
import Like from './Like';
import Media from './Media';
import sequelize from './sequelize';
import User from './User';

const Post = sequelize.define(
  'Post',
  {
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
  },
  {
    indexes: [
      {
        name: 'search_index',
        type: 'FULLTEXT',
        fields: ['title', 'textContent'],
      },
    ],
  }
);

User.hasMany(Post, { foreignKey: 'creatorId' });
Post.belongsTo(User, { foreignKey: 'creatorId' });

Post.hasMany(Media, {
  foreignKey: 'postId',
  as: 'media',
});

Post.hasMany(Like, {
  foreignKey: 'postId',
  as: 'likes',
});

Post.prototype.toJSON = async function toJSON() {
  const creator = await this.getUser();

  return {
    ...(await this.toSimpleJSON()),
    creator: await creator.toJSON(),
  };
};

Post.prototype.toSimpleJSON = async function toJSON() {
  return {
    id: this.id,
    title: this.title,
    textContent: this.textContent,
    cratedAd: this.createdAt,
    updatedAt: this.updatedAt,
    media: await this.getMedia(),
    likes: await this.getLikes(),
  };
};

export default Post;

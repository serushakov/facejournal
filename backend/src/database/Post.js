import { DataTypes } from 'sequelize';
import Media from './Media';
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

User.hasMany(Post, { foreignKey: 'creatorId' });
Post.belongsTo(User, { foreignKey: 'creatorId' });

Post.hasMany(Media, {
  foreignKey: 'postId',
  as: 'media',
});

Post.prototype.toJSON = async function toJSON() {
  const creator = await this.getUser();

  return {
    id: this.id,
    title: this.title,
    textContent: this.textContent,
    cratedAd: this.createdAt,
    updatedAt: this.updatedAt,
    creator: await creator.toJSON(),
    media: await this.getMedia(),
  };
};

export default Post;

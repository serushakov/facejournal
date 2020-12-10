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
      {
        name: 'email_index',
        fields: ['email'],
      },
    ],
  }
);

User.prototype.toJSON = async function toJSON() {
  const role = await this.getRole();
  const permissions = (await role.getPermissions()).map((item) => item.name);

  return {
    firstName: this.firstName,
    lastName: this.lastName,
    id: this.id,
    email: this.email,
    avatar: this.avatar,
    coverImage: this.coverImage,
    createdAt: this.createdAt,
    permissions,
  };
};

User.prototype.toSubscriptionJson = function toSubscriptionJson() {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    id: this.id,
    avatar: this.avatar,
  };
};

const getFriendshipStatus = async (user1, user2) => {
  const isPending = await user1.hasFriend(user2.id);
  const isRequested = await user2.hasFriend(user1.id);

  if (isPending && isRequested) return 'friend';

  if (isRequested) return 'requested';
  if (isPending) return 'pending';

  return 'none';
};

User.prototype.toMeJson = async function toMeJson() {
  const subscriptions = (await this.getSubscriptions()).map((user) =>
    user.toSubscriptionJson()
  );

  return {
    ...(await this.toJSON()),
    followerCount: await this.countFollowers(),
    subscriptions,
  };
};

User.prototype.toJsonWithFriendship = async function toJsonWithFriendship(
  currentUser
) {
  const friendshipStatus =
    currentUser && (await getFriendshipStatus(currentUser, this));

  return {
    firstName: this.firstName,
    lastName: this.lastName,
    id: this.id,
    email: this.email,
    avatar: this.avatar,
    coverImage: this.coverImage,
    createdAt: this.createdAt,
    friendshipStatus,
  };
};

export default User;

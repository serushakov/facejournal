import { DataTypes, Sequelize } from "sequelize";
import sequelize from "./sequelize";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  // Model attributes are defined here
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
});

export const Friendship = sequelize.define("Friendship", {
  friendId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: User,
    },
  },
});

User.belongsToMany(User, { as: "friends", through: Friendship });

export default User;

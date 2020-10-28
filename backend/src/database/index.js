import sequelize, { initialize } from "./sequelize";
import User, { Friendship } from "./User";

(async () => {
  await initialize();
  await User.sync();
  await Friendship.sync();
})();

export { sequelize, User, Friendship };

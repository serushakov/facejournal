import { default as sequelize, initialize } from "./sequelize";
import { default as User } from "./User";

(async () => {
  await initialize();
  await User.sync();
})();

export { sequelize, User };

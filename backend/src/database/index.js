import { default as sequelize, initialize } from "./sequelize.js";
import { default as User } from "./User.js";

(async () => {
  await initialize();
  await User.sync();
})();

export { sequelize, User };

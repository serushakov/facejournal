import Sequelize from "sequelize";

const sequelize = new Sequelize("db", "user", "password", {
  host: "db",
  port: 3306,
  dialect: "mariadb",

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

export async function initialize() {
  try {
    await sequelize.authenticate();

    console.log("Sequelize: Connection has been established successfully.");
  } catch (error) {
    console.error("Sequelize: Unable to connect to the database:", error);
  }
}

export default sequelize;

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost:3306",
  dialect: "mariadb",

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

module.exports = sequelize;

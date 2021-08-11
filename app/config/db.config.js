const config = require("config");
module.exports = {
  HOST: config.get("db.host"),
  USER: config.get("db.user"),
  PASSWORD: config.get("db.password"),
  DB: config.get("db.db"),
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

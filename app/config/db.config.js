module.exports = {
  HOST: "localhost",
  USER: "mortgage_user",
  PASSWORD: "mortgage_password",
  DB: "mortgage",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

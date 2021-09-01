module.exports = {
  HOST: "localhost",
  USER: "hillary",
  PASSWORD: "",
  DB: "hillary",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// knexfile.js

module.exports = {
  client: "sqlite3",
  migration: {
    path: "cars.sqlite"
  },
  connection: {
    filename: "./database/database.sqlite"
  }
};

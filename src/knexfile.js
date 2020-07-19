// knexfile.js

// don't think this is in use
module.exports = {
  client: "sqlite3",
  migration: {
    path: "cars.db",
  },
  connection: {
    filename: "./cars.db",
  },
};

const knex = require("knex")(require("./knexfile"));

module.exports = {
  carList() {
    console.log(`retrieving cars`);
    return knex("cars").select("*");
  }
};

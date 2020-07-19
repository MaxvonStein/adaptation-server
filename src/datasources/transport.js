const { SQLDataSource } = require("datasource-sql");

// try fetchOne to pop the result out of an array

class TransportAPI extends SQLDataSource {
  getCities() {
    return this.db.select("*").from("transportTimelines");
  }

  getCityByName({ city }) {
    return this.db
      .select("*")
      .from("taxJurisdictions")
      .where({ city: city })
      .limit(1)
      .first();
  }
}

module.exports = TransportAPI;

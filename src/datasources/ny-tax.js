const { SQLDataSource } = require("datasource-sql");

// try fetchOne to pop the result out of an array

class NYTaxAPI extends SQLDataSource {
  getJurisdictions() {
    return this.db.select("*").from("taxJurisdictions");
    // .map(car => {
    //   car.customerState = customerState;
    //   debugger;
    // });
  }

  // how to include the city jurisdictions with the cityCounty column, want these to come up when the county is searched

  getJurisdictionsByName({ countyName }) {
    return this.db
      .select("*")
      .from("taxJurisdictions")
      .where({ taxJurisdiction: countyName })
      .limit(1)
      .first();
    // .then(cars => {
    //   return cars[0];
    // });
  }

  getCitiesByCityCounty({ cityCounty }) {
    return this.db
      .select("*")
      .from("taxJurisdictions")
      .where({ cityCounty });
  }
}

module.exports = NYTaxAPI;

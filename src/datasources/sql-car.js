const { SQLDataSource } = require("datasource-sql");

const MINUTE = 60;

// class CarAPI extends SQLDataSource {
//   getFruits() {
//     return this.db
//       .select("*")
//       .from("fruit")
//       .where({ id: 1 })
//       .cache(MINUTE);
//   }
// }

// try fetchOne to pop the result out of an array

class SQLCarAPI extends SQLDataSource {
  getCars() {
    return this.db.select("*").from("cars").cache(MINUTE);
    // .map(car => {
    //   car.customerState = customerState;
    //   debugger;
    // });
  }

  getCarByVin({ vin }) {
    return this.db
      .select("*")
      .from("cars")
      .where({ vin: vin })
      .limit(1)
      .first();
    // .then(cars => {
    //   return cars[0];
    // });
  }
}

module.exports = SQLCarAPI;

const { SQLDataSource } = require("datasource-sql");

// try fetchOne to pop the result out of an array

class InsuranceEstimateAPI extends SQLDataSource {
  getInsuranceEstimate({ customerState, driver }) {
    return this.db
      .select("*")
      .from("insuranceEstimates")
      .where({ customerState })
      .where({ driver })
      .limit(1)
      .first();
  }
}

module.exports = InsuranceEstimateAPI;

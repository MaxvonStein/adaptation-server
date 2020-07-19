const { MongoDataSource } = require("apollo-datasource-mongodb");

class MongoCarAPI extends MongoDataSource {
  // what's the format for adding more queries, get all cars
  async getCarById(make) {
    // this.collection? source: https://stackoverflow.com/questions/59657450/mongoerror-topology-is-closed-please-connect
    // id could be in the wrong format, it's just a string in the playground
    return await this.collection.findOne({ make });
  }
}

module.exports = MongoCarAPI;

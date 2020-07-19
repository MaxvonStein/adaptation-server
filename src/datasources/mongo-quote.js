const mongodb = require("mongodb");
const { MongoDataSource } = require("apollo-datasource-mongodb");

class MongoQuoteAPI extends MongoDataSource {
  async insertLeaseQuote(lease) {
    // how does the quote id come in?  how does this get returned?  does mongodb create an object id when one's not provided?
    // find an example
    return this.collection.insertOne(lease);

    // return { ...response, _id: response.insertedId };
  }
  // need a getQuoteById here
  async getLeaseQuoteById({ quoteId }) {
    return this.findOneById(mongodb.ObjectId(quoteId));
  }
}

module.exports = MongoQuoteAPI;

// index.js from SQLDataSource example

const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { MongoClient } = require("mongodb");

const SQLCarAPI = require("./datasources/sql-car");

const NYZipAPI = require("./datasources/ny-zip");

const NYTaxAPI = require("./datasources/ny-tax");

// const TransportAPI = require("./datasources/transport");

const InsuranceEstimateAPI = require("./datasources/insurance-estimate");

const MongoCarAPI = require("./datasources/mongo-car");

const MongoQuoteAPI = require("./datasources/mongo-quote");

const { AWSS3Uploader } = require("./uploaders/s3");

const s3Uploader = new AWSS3Uploader({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  destinationBucketName: "skips-virginia",
});

const knexConfig = {
  client: "sqlite",
  connection: {
    filename:
      "C:/Users/mevon/Documents/React/apollo/tutorial-adaptation/fullstack-tutorial/final/server/car-tables.sqlite",
  },
  useNullAsDefault: true,
};

// somehow we get an cannot read property get error if this isn't defined ahead of time - cannot use new SQ.. for value of sqlCarAPI
// check other datasources too
const SQLCarDataSource = new SQLCarAPI(knexConfig);

// const TransportDataSource = new TransportAPI(knexConfig);

const InsuranceDataSource = new InsuranceEstimateAPI(knexConfig);

// quick try based on: https://stackoverflow.com/questions/59657450/mongoerror-topology-is-closed-please-connect
const dbURL = `mongodb+srv://${process.env.MONGO_USER_USERNAME}:${process.env.MONGO_USER_PASSWORD}@cluster0-ymlex.mongodb.net/test?retryWrites=true&w=majority`;
const dbName = "test";

const init = (db) => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      mongoCarAPI: new MongoCarAPI(db.collection("cars")),
      mongoQuoteAPI: new MongoQuoteAPI(db.collection("leaseQuotes")),
      sqlCarAPI: SQLCarDataSource,
      zipAPI: new NYZipAPI(),
      // will need to migrate this from SQL to Mongo
      taxAPI: new NYTaxAPI(knexConfig),
      insuranceEstimateAPI: new InsuranceEstimateAPI(knexConfig),
    }),
  });
};

// Use .connect() instead of new MongoClient
// Pass the new db to the init function defined above once it's been defined
// Call server.listen() from within MongoClient
MongoClient.connect(
  dbURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) console.log("error: ", error);
    const db = client.db(dbName);
    console.log(`Mongo database ${dbName} at ${dbURL}`);

    const server = init(db);

    server.listen().then(({ url }) => {
      console.log(`Server ready at ${url}`);
    });
  }
);

// export all the important pieces for integration/e2e tests to use
// module.exports = {
//   server,
//   NYZipAPI,
//   NYTaxAPI,
// };

// require('dotenv').config();

const { ApolloServer } = require("apollo-server");
const isEmail = require("isemail");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const { createStore } = require("./utils");

const { MongoClient } = require("mongodb");

const LaunchAPI = require("./datasources/launch");
const UserAPI = require("./datasources/user");

const NYZipAPI = require("./datasources/ny-zip");

// equivalent to MyDatabase in SQLDataSource readme
const CarAPI = require("./datasources/car");

const MongoCarAPI = require("./datasources/mongo-cars");

// update url

const mongoClient = new MongoClient(
  "mongodb+srv://sampleuser:passwordhere@cluster0-ymlex.mongodb.net/test?retryWrites=true&w=majority"
);

mongoClient.connect();

// const knexConfig = require("./knexfile");

const knexConfig = {
  client: "sqlite",
  connection: {
    filename: "./server/cars.sqlite",
  },
};

// carDb is equivalent to db in SQLDataSource readme
const db = new CarAPI(knexConfig);

const internalEngineDemo = require("./engine-demo");

// creates a sequelize connection once. NOT for every request
const store = createStore();

// set up any dataSources our resolvers need
const dataSources = () => ({
  launchAPI: new LaunchAPI(),
  userAPI: new UserAPI({ store }),
  carAPI: new CarAPI({ db }),
  zipAPI: new NYZipAPI(),
  mongoCarAPI: new MongoCarAPI(mongoClient.db().collection("cars")),
});

// the function that sets up the global context for each resolver, using the req
const context = async ({ req }) => {
  // simple auth check on every request
  const auth = (req.headers && req.headers.authorization) || "";
  const email = new Buffer(auth, "base64").toString("ascii");

  // if the email isn't formatted validly, return null for user
  if (!isEmail.validate(email)) return { user: null };
  // find a user by their email
  const users = await store.users.findOrCreate({ where: { email } });
  const user = users && users[0] ? users[0] : null;

  return { user: { ...user.dataValues } };
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  engine: {
    apiKey: process.env.ENGINE_API_KEY,
    ...internalEngineDemo,
  },
});

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== "test")
  server
    .listen({ port: 4000 })
    .then(({ url }) => console.log(`🚀 app running at ${url} on index.js`));

// export all the important pieces for integration/e2e tests to use
module.exports = {
  dataSources,
  context,
  typeDefs,
  resolvers,
  ApolloServer,
  LaunchAPI,
  UserAPI,
  NYZipAPI,
  store,
  server,
};

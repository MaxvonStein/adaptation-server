const { paginateResults } = require("./utils");
const fetch = require("node-fetch");
const { sendEmail } = require("./utils/sendEmail");
const stripeServer = require("./utils/stripeServer");

const { AWSS3Uploader } = require("./uploaders/s3");

const s3 = require("./uploaders/s3-simple");

const { extname } = require("path");

const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");

module.exports = {
  Query: {
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      // we want these in reverse chronological order
      allLaunches.reverse();

      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches,
      });

      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        // if the cursor of the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false,
      };
    },
    launch: (_, { id }, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),
    me: async (_, __, { dataSources }) =>
      dataSources.userAPI.findOrCreateUser(),
    // cars: async (_, { vin }, { dataSources }) => dataSources.carAPI.getCars()
    // temporary comment while debugging s3 and commenting datasource apis in index-simple
    // cars: async (_, __, { dataSources }) => dataSources.sqlCarAPI.getCars(),
    cars: async (_, __, { dataSources }) => dataSources.mongoCarAPI.getCars(),
    mongoCar: async (_, { make }, { dataSources }) =>
      dataSources.mongoCarAPI.getCarById(make),
    mongoCars: async (_, __, { dataSources }) =>
      dataSources.mongoCarAPI.getCars(),
    car: async (_, { vin }, { dataSources }) =>
      dataSources.sqlCarAPI.getCarByVin({ vin }),
    // don't know if we need this here, it's all server data
    county: async (_, { zip }, { dataSources }) =>
      dataSources.zipAPI.getCountyByZip({ zip }),
    counties: async (_, __, { dataSources }) =>
      dataSources.zipAPI.getAllCounties(),
    rate: async (_, { countyName }, { dataSources }) =>
      dataSources.taxAPI.getJurisdictionsByName({ countyName }),
    // user: (_, __, { dataSources }) => {
    //   dataSources.zipAPI.getPerson();
    // },
    countySimple: async (_, { zip }, { dataSources }) => {
      const response = await fetch(
        `https://data.ny.gov/resource/juva-r6g2.json?zip_code=10994`,
        {
          method: "GET",
          headers: { "X-App-Token": "P98N4lriCOtOzsXeoKMRdtvWe" },
        }
      );
      const data = await response.json();
      return data[0];
    },
    insuranceEstimate: async (_, { customerState, driver }, { dataSources }) =>
      dataSources.insuranceEstimateAPI.getInsuranceEstimate({
        customerState,
        driver,
      }),
    leaseQuote: async (_, { quoteId }, { dataSources }) =>
      await dataSources.mongoQuoteAPI.getLeaseQuoteById({ quoteId }),
    // loadLeaseQuote: async (_, {quoteId}, {dataSources}) => {
    //   const leaseQuote = await dataSources.mongoQuoteAPI.getLeaseQuoteById({})
    // },
    randomPerson: async () => {
      const response = await fetch("https://api.randomuser.me/");
      const data = await response.json();
      return data.results;
    },
  },
  Date: GraphQLDateTime,
  Mutation: {
    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds });
      const launches = await dataSources.launchAPI.getLaunchesByIds({
        launchIds,
      });

      return {
        success: results && results.length === launchIds.length,
        message:
          results.length === launchIds.length
            ? "trips booked successfully"
            : `the following launches couldn't be booked: ${launchIds.filter(
                (id) => !results.includes(id)
              )}`,
        launches,
      };
    },
    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const result = dataSources.userAPI.cancelTrip({ launchId });

      if (!result)
        return {
          success: false,
          message: "failed to cancel trip",
        };

      const launch = await dataSources.launchAPI.getLaunchById({ launchId });
      return {
        success: true,
        message: "trip cancelled",
        launches: [launch],
      };
    },
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) return new Buffer(email).toString("base64");
    },
    sendEmail: async (_, { recipient, messageText }, { dataSources }) => {
      const response = await sendEmail(recipient, messageText);
      console.log("sendEmail response", response);
      // return response;
      // not sure what the problem is here, maybe walk through each step and console log everything
      return {
        success: true,
        message: "resolver message",
        __typename: "SendEmailResponse",
      };
    },
    singleUpload: AWSS3Uploader.prototype.singleFileUploadResolver.bind(
      AWSS3Uploader
    ),
    uploadFile: async (_, { file, label }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;

      const { Location } = await s3
        .upload({
          Body: createReadStream(),
          // removed extname(filename) to include customer's filename
          Key: `${label}-${filename}`,
          ContentType: mimetype,
        })
        .promise();

      return {
        filename,
        mimetype,
        encoding,
        uri: Location,
      };
    },
    createPaymentIntent: async (_, { amount }, { dataSources }) => {
      // let id, amount, amount_reveived, client_secret

      const paymentIntent = await stripeServer.createPaymentIntent(amount);

      const { id, amount_received, client_secret } = paymentIntent;
      return { id, amount, amount_received, client_secret };
    },
    insertLeaseQuote: async (_, { lease }, { dataSources }) => {
      console.log("insertLeaseQuote resolver");
      // const result = await dataSources.mongoQuoteAPI.insertLeaseQuote(
      //   pickupLocation
      // );
      // console.log("result");
      // console.log(result);

      const {
        insertedId: _id,
        ops: [insertedLeaseQuote],
      } = await dataSources.mongoQuoteAPI.insertLeaseQuote(lease);
      console.log("insertedLeaseQuote");
      console.log(insertedLeaseQuote);
      console.log("^ insertedLeaseQuote");
      // the issue was with returning the Lease object, maybe need to come up with another object type, definately recheck how this is supposed to work
      console.log("returning");
      console.log({ ...insertedLeaseQuote, __typename: "Lease" });
      return insertedLeaseQuote;
    },
  },
  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
  },
  Mission: {
    // make sure the default size is 'large' in case user doesn't specify
    missionPatch: (mission, { size } = { size: "LARGE" }) => {
      return size === "SMALL"
        ? mission.missionPatchSmall
        : mission.missionPatchLarge;
    },
  },
  User: {
    trips: async (_, __, { dataSources }) => {
      // get ids of launches by user
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

      if (!launchIds.length) return [];

      // look up those launches by their ids
      return (
        dataSources.launchAPI.getLaunchesByIds({
          launchIds,
        }) || []
      );
    },
  },
};

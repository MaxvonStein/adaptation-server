const { gql } = require("apollo-server");
const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");

// const mongoose = require("mongoose");

const typeDefs = gql`
  scalar Date
  type Query {
    launches(
      """
      The number of results to show. Must be >= 1. Default = 20
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      """
      after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    me: User
    # cars(pageSize: Int, after: String): CarConnection!
    cars: [Car!]
    car(vin: String!): Car
    mongoCar(make: String): Car
    mongoCars: [Car]
    county(zip: String!): County
    counties: [County]
    rate(countyName: String!): Rate
    countySimple(zip: String!): County
    insuranceEstimate(customerState: String!, driver: String!): Premium
    leaseQuote(quoteId: ID!): Lease
    user: User
    randomPerson: [Person!]!
  }

  type Car {
    vin: String!
    year: Int!
    make: String!
    model: String!
    makeModel: String!
    trim: String
    mileage: Int!
    type: String
    drivetrain: String
    retailPrice: Int!
    leaseFirst: Int!
    leaseMonthly: Int!
    transportCost: Int
    exteriorColor: String
    interiorColor: String
    supplier: String
    location: String
    transportTimeline: Int
    deliveryDays: Int
    leaseTotal: Int
    leaseQuote: Lease
  }

  type Lease {
    # _id: mongoose.Schema.Types.ObjectId
    _id: ID
    pickupLocation: String
    dropoffLocation: String
    transportCost: Int
    secondLegFee: Int
    dropoffLegFee: Int
    leaseTotal: Float
    firstMonthSalesTax: Float
    firstMonthRentalTax: Float
    monthlySalesTax: Float
    monthlyRentalTax: Float
    proration: Float
    dropoffLegSalesTax: Float
    dropoffLegRentalTax: Float
    paymentsTotal: Float
    leaseFirst: Int
    leaseMonthly: Int
    customerPickupDate: Date
    customerLeaseMonths: Float
    vin: String
    yearMakeModel: String
    insuranceMonthly: Float
    insuranceAccuracy: String
    customerState: String
    stateAccuracy: String
    customerTaxRate: Float
    taxRateAccuracy: String
    createdDate: Date
  }

  type County {
    county: String
    state_fips: String
    county_code: String
    county_fips: String
    zip_code: String
    file_date: String
  }

  type Rate {
    taxJurisdiction: String!
    rate: Float!
    isCity: Int!
    cityCounty: String
  }

  type Premium {
    customerState: String
    driver: String
    lowEstimate: Int!
    highEstimate: Int!
    averageEstimate: Int!
  }

  # type customerPickupDate {
  #   date: Date
  # }

  type CarConnection {
    cursor: String!
    hasMore: Boolean!
    cars: [Car]!
  }

  type UploadedFileResponse {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }

  type File {
    uri: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type SendEmailResponse {
    success: Boolean!
    message: String!
  }

  type PaymentIntent {
    id: String!
    amount: Int!
    amount_received: Int!
    client_secret: String!
  }

  # type InsertLeaseQuoteResponse {
  #   success: Boolean!
  #   id: ID!
  #   message: String
  # }

  input LeaseInputTest {
    pickupLocation: String
  }

  # test a realy basic input, this looks right see here: https://www.apollographql.com/docs/apollo-server/schema/schema/#input-types
  input LeaseInput {
    pickupLocation: String
    dropoffLocation: String
    transportCost: Int
    secondLegFee: Int
    dropoffLegFee: Int
    leaseTotal: Float
    firstMonthSalesTax: Float
    firstMonthRentalTax: Float
    monthlySalesTax: Float
    monthlyRentalTax: Float
    proration: Float
    dropoffLegSalesTax: Float
    dropoffLegRentalTax: Float
    paymentsTotal: Float
    leaseFirst: Int
    leaseMonthly: Int
    customerPickupDate: Date
    customerLeaseMonths: Float
    vin: String
    yearMakeModel: String
    insuranceMonthly: Float
    insuranceAccuracy: String
    customerState: String
    stateAccuracy: String
    customerTaxRate: Float
    taxRateAccuracy: String
    createdDate: Date
  }

  # type Date GraphQLDate

  type Mutation {
    # if false, signup failed -- check errors
    bookTrips(launchIds: [ID]!): TripUpdateResponse!

    # if false, cancellation failed -- check errors
    cancelTrip(launchId: ID!): TripUpdateResponse!

    login(email: String): String # login token
    sendEmail(
      recipient: String
      messageText: String # subject: String
    ): SendEmailResponse
    singleUpload(file: Upload!): UploadedFileResponse!
    uploadFile(file: Upload!, label: String!): File
    createPaymentIntent(amount: Int): PaymentIntent
    insertLeaseQuote(lease: LeaseInput): Lease
  }

  # // look at other github projects with schemas that have input XXX {

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  """
  Simple wrapper around our list of launches that contains a cursor to the
  last item in the list. Pass this cursor to the launches query to fetch results
  after these.
  """
  type LaunchConnection {
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  }

  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  enum PatchSize {
    SMALL
    LARGE
  }

  type Person {
    gender: String
    email: String
    phone: String
  }
`;

module.exports = typeDefs;

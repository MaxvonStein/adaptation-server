// source: https://dev.to/fhpriamo/painless-graphql-file-uploads-with-apollo-server-to-amazon-s3-and-local-filesystem-1bn0

// src/s3.js -- final revision

const AWS = require("aws-sdk");

const config = {
  s3: {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: "us-east-1",
    params: {
      ACL: "public-read",
      Bucket: "skips-virginia",
    },
  },
  // does this need to be here?
  // app: {
  //   storageDir: "tmp",
  // },
};

module.exports = new AWS.S3(config.s3);

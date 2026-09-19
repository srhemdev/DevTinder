const { SESClient } = require("@aws-sdk/client-ses");

// Define your target AWS region
const REGION = "us-west-1";

// Create the SES client object
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

module.exports = { sesClient };
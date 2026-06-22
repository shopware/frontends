"use strict";

const fs = require("fs");
// Please Update the below mentioned values before running test cases

const configArgs = {
  publicKeyId: "", // Enter your Public Key ID
  privateKey: fs.readFileSync("AmazonPay_publicKeyId.pem"), // Path to your private key file
  region: "eu",
  sandbox: true,
  currencyCode: "EUR",
  countryCode: "DE",
  storeId: "amzn1.application-oa2-client.xxxxxxxxx",
};

module.exports = configArgs;

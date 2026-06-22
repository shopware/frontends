"use strict";

// Including Required Modules
const Client = require("../src/client");
const config = require("./config");
const configWithAlgorithm = require("./configWithAlgorithm");
const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");

const publicKey = ``; // Provide public key here to run the tests

const generateButtonSignaturePayloadObject = {
  storeId: "amzn1.application-oa2-client.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  webCheckoutDetails: {
    checkoutReviewReturnUrl: "https://localhost/test/CheckoutReview.php",
    checkoutResultReturnUrl: "https://localhost/test/CheckoutResult.php",
  },
};
const generateButtonSignaturePayloadString =
  '{"storeId":"amzn1.application-oa2-client.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","webCheckoutDetails":{"checkoutReviewReturnUrl":"https://localhost/test/CheckoutReview.php","checkoutResultReturnUrl":"https://localhost/test/CheckoutResult.php"}}';
const generateButtonSignaturePayloadEscapedString =
  '{"storeId":"amzn1.application-oa2-client.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","webCheckoutDetails":{"checkoutReviewReturnUrl":"https://localhost/test/CheckoutReview.php","checkoutResultReturnUrl":"https://localhost/test/CheckoutResult.php"}}';
const expectedStringToSign = `AMZN-PAY-RSASSA-PSS
8dec52d799607be40f82d5c8e7ecb6c171e6591c41b1111a576b16076c89381c`;
const expectedStringToSignWithV2Algorithm = `AMZN-PAY-RSASSA-PSS-V2
8dec52d799607be40f82d5c8e7ecb6c171e6591c41b1111a576b16076c89381c`;

const mwsAuthToken = ""; // Provide public key here to run the tests
const merchantId = ""; // Provide merchantId

function verify(signature, algorithm = null) {
  var stringToSign = "";
  if (algorithm) {
    stringToSign = expectedStringToSignWithV2Algorithm;
  } else {
    stringToSign = expectedStringToSign;
  }
  var verifier = crypto.createVerify("RSA-SHA256").update(stringToSign);
  return verifier.verify(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    },
    signature,
    "base64",
  );
}

describe("AmazonPay Client Test Cases - Generate Button Signature", () => {
  before(function () {
    if (!publicKey) {
      console.error(
        "Please provide publicKey before executing these test cases",
      );
      this.skip();
    }
  });
  it("Validating Generate Button Signature Method", (done) => {
    const amazonPayCLient = new Client.AmazonPayClient(config);
    const signatureOne = amazonPayCLient.generateButtonSignature(
      generateButtonSignaturePayloadObject,
    );
    const signatureTwo = amazonPayCLient.generateButtonSignature(
      generateButtonSignaturePayloadString,
    );
    const signatureThree = amazonPayCLient.generateButtonSignature(
      generateButtonSignaturePayloadEscapedString,
    );
    assert.ok(verify(signatureOne), "Failed for JS object payload");
    assert.ok(verify(signatureTwo), "Failed for string payload");
    assert.ok(verify(signatureThree), "Failed for escaped string payload");

    //Test with V2 Algorithm passed in config
    const amazonPayCLientWithAlgorithm = new Client.AmazonPayClient(
      configWithAlgorithm,
    );
    const signatureOneWithAlgorithm =
      amazonPayCLientWithAlgorithm.generateButtonSignature(
        generateButtonSignaturePayloadObject,
      );
    const signatureTwoWithAlgorithm =
      amazonPayCLientWithAlgorithm.generateButtonSignature(
        generateButtonSignaturePayloadString,
      );
    const signatureThreeWithAlgorithm =
      amazonPayCLientWithAlgorithm.generateButtonSignature(
        generateButtonSignaturePayloadEscapedString,
      );
    assert.ok(
      verify(signatureOneWithAlgorithm, configWithAlgorithm["algorithm"]),
      "Failed for JS object payload",
    );
    assert.ok(
      verify(signatureTwoWithAlgorithm, configWithAlgorithm["algorithm"]),
      "Failed for string payload",
    );
    assert.ok(
      verify(signatureThreeWithAlgorithm, configWithAlgorithm["algorithm"]),
      "Failed for escaped string payload",
    );
    done();
  });
});

describe("AmazonPay Client Test Cases - Get Authorization Token", () => {
  before(function () {
    if (!mwsAuthToken || !merchantId) {
      console.error(
        "Please provide mwsAuthToken and merchantId before executing these test cases",
      );
      this.skip();
    }
  });
  it("Validating Get Authorization Token API", (done) => {
    const configCopy = { ...config };
    configCopy.sandbox = false;
    const amazonPayCLient = new Client.AmazonPayClient(configCopy);
    amazonPayCLient
      .getAuthorizationToken(mwsAuthToken, merchantId)
      .then(function (result) {
        var actualResponse = result.data;
        assert.ok(actualResponse.authorizationToken);
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });

  it("Validating Get Authorization Token API with V2 Algorithm", (done) => {
    const configCopy = { ...configWithAlgorithm };
    configCopy.sandbox = false;
    const amazonPayCLientWithAlgorithm = new Client.AmazonPayClient(configCopy);
    amazonPayCLientWithAlgorithm
      .getAuthorizationToken(mwsAuthToken, merchantId)
      .then(function (result) {
        var actualResponse = result.data;
        assert.ok(actualResponse.authorizationToken);
        done();
      })
      .catch(function (err) {
        done(err);
      });
  });
});

"use strict";

// Including Required Modules
const helper = require("../../src/clientHelper");
const constants = require("../../src/constants");
const assert = require("assert");

// Constants
const expectedLiveURI = "live/v2/serviceName";
const expectedSandboxURI = "sandbox/v2/serviceName";
const expectedUnfiedURI = "v2/serviceName";

// Test cases to validate Environment specific URI
describe("Test Environment specific URI Test cases", () => {
  // Test to validate URI for Live  specific URI
  it("Testing Live specific URI", (done) => {
    const response = helper.prepareOptions(getPayConfig(false), {
      urlFragment: "serviceName",
    });
    assert.strictEqual(response.urlFragment, expectedLiveURI);

    //Test with V2 Algorithm passed in config
    const responseWithAlgorithm = helper.prepareOptions(
      getPayConfig(false, constants.AMAZON_SIGNATURE_ALGORITHM.V2),
      { urlFragment: "serviceName" },
    );
    assert.strictEqual(responseWithAlgorithm.urlFragment, expectedLiveURI);

    done();
  });

  // Test to validate URI for Sandbox  specific URI
  it("Testing Sandbox specific URI", (done) => {
    const response = helper.prepareOptions(getPayConfig(true), {
      urlFragment: "serviceName",
    });
    assert.strictEqual(response.urlFragment, expectedSandboxURI);

    //Test with V2 Algorithm passed in config
    const responseWithAlgorithm = helper.prepareOptions(
      getPayConfig(true, constants.AMAZON_SIGNATURE_ALGORITHM.V2),
      { urlFragment: "serviceName" },
    );
    assert.strictEqual(responseWithAlgorithm.urlFragment, expectedSandboxURI);

    done();
  });

  // Generic method used to create Pay Configuration
  function getPayConfig(sandboxFlag, algorithmPassed = null) {
    let payConfig = {
      publicKeyId: "XXXXXXXXXXXXXXXXXXXXXXXX",
      privateKey: "keys/private.pem",
      sandbox: sandboxFlag,
      region: "us",
    };

    if (algorithmPassed) {
      payConfig["algorithm"] = algorithmPassed;
    }
    return payConfig;
  }
});

// Test cases to validate Unified Endpoint specific URI
describe("Test Environment specific URI Test cases", () => {
  // Testing Unified endpoint URI by passing Live specific PublicKeyId
  it("Testing Unified endpoint URI for Live PublicKeyId", (done) => {
    const options = { urlFragment: "serviceName" };
    const response = helper.prepareOptions(
      getPayConfig("LIVE-XXXXXXXXXXXXXXXXXXXXXXXX"),
      { urlFragment: "serviceName" },
    );
    assert.strictEqual(response.urlFragment, expectedUnfiedURI);

    //Test with V2 Algorithm passed in config
    const responseWithAlgorithm = helper.prepareOptions(
      getPayConfig(
        "LIVE-XXXXXXXXXXXXXXXXXXXXXXXX",
        constants.AMAZON_SIGNATURE_ALGORITHM.V2,
      ),
      { urlFragment: "serviceName" },
    );
    assert.strictEqual(responseWithAlgorithm.urlFragment, expectedUnfiedURI);
    done();
  });

  // Testing Unified endpoint URI by passing Sandbox specific PublicKeyId
  it("Testing Unified endpoint URI for Sandbox PublicKeyId", (done) => {
    const options = { urlFragment: "serviceName" };
    const response = helper.prepareOptions(
      getPayConfig("SANDBOX-XXXXXXXXXXXXXXXXXXXXXXXX"),
      { urlFragment: "serviceName" },
    );
    assert.strictEqual(response.urlFragment, expectedUnfiedURI);

    //Test with V2 Algorithm passed in config
    const responseWithAlgorithm = helper.prepareOptions(
      getPayConfig(
        "SANDBOX-XXXXXXXXXXXXXXXXXXXXXXXX",
        constants.AMAZON_SIGNATURE_ALGORITHM.V2,
      ),
      { urlFragment: "serviceName" },
    );
    assert.strictEqual(responseWithAlgorithm.urlFragment, expectedUnfiedURI);

    done();
  });

  // Generic method used to create Pay Configuration
  function getPayConfig(publicKeyId, algorithmPassed = null) {
    let payConfig = {
      publicKeyId: publicKeyId,
      privateKey: "keys/private.pem",
      region: "us",
    };

    if (algorithmPassed) {
      payConfig["algorithm"] = algorithmPassed;
    }
    return payConfig;
  }
});

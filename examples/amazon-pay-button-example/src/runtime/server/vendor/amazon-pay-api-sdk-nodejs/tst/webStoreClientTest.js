"use strict";

// Including Required Modules
const Client = require("../src/client");
const config = require("./config");
const configWithAlgorithm = require("./configWithAlgorithm");
const assert = require("assert");
const uuidv4 = require("uuid/v4");
const headers = {
  "x-amz-pay-idempotency-key": uuidv4().toString().replace(/-/g, ""),
};
const headersWithV2Algorithm = {
  "x-amz-pay-idempotency-key": uuidv4().toString().replace(/-/g, ""),
};

const chargePermissionId = ""; // Enter Charge Permission ID
const chargePermissionIdWithV2Algorithm = ""; // Enter Charge Permission ID
const buyerToken = ""; // Enter Buyer Token
const buyerTokenWithV2Algorithm = ""; // Enter Buyer Token
const finalizeCheckoutSessionId = ""; // Enter Chechout Session Id for SPC flow
const finalizeCheckoutSessionIdWithV2Algorithm = ""; // Enter Chechout Session Id for SPC flow
const pspChargeId = ""; // Enter PSP Charge ID for updateCharge API
const pspChargeIdWithV2Algorithm = ""; // Enter PSP Charge ID for updateCharge API

// Initiating WebStoreClient Class
const webStoreClient = new Client.WebStoreClient(config);
const webStoreClientWithAlgorithm = new Client.WebStoreClient(
  configWithAlgorithm,
);

// Constants required to execute Unit Test cases
var checkoutSessionId;
var chargeId;
var chargeIdWithV2Algorithm;
var refundId;
var merchantAccountId;
var reportScheduleId;
var disputeId;
var uniqueReferenceId;
var authorizationToken;

const createCheckoutSessionPayload = {
  webCheckoutDetails: {
    checkoutReviewReturnUrl: "https://localhost/maxo/checkoutReview.html",
    checkoutResultReturnUrl: "https://localhost/maxo/checkoutReturn.html",
  },
  storeId: config.storeId, // Enter Store ID
};
const updateCheckoutSessionPayload = {
  paymentDetails: {
    paymentIntent: "Confirm",
    chargeAmount: {
      amount: 50,
      currencyCode: config.currencyCode,
    },
  },
  merchantMetadata: {
    merchantReferenceId: uuidv4().toString().replace(/-/g, ""),
    merchantStoreName: "Test Shop EU",
    noteToBuyer: "Thank you for your order!",
  },
};
const completeCheckoutSessionPayload = {
  chargeAmount: {
    amount: 50,
    currencyCode: config.currencyCode,
  },
};
const finalizeCheckoutSessionPayload = {
  shippingAddress: {
    name: "Susie Smith",
    addressLine1: "10 Ditka Ave",
    addressLine2: "Suite 2500",
    city: "Chicago",
    county: null,
    district: null,
    stateOrRegion: "IL",
    postalCode: "60602",
    countryCode: "US",
    phoneNumber: "800-000-0000",
  },
  billingAddress: null,
  chargeAmount: {
    amount: "10",
    currencyCode: "USD",
  },
  totalOrderAmount: {
    amount: "10",
    currencyCode: "USD",
  },
  paymentIntent: "Confirm",
  canHandlePendingAuthorization: false,
  supplementaryData: "TestSupplementaryData-onInitCheckout",
};
const updateChargePermissionPayload = {
  merchantMetadata: {
    merchantReferenceId: uuidv4().toString().replace(/-/g, ""),
    merchantStoreName: "Test Shop EU",
    noteToBuyer: "Thank you for your order!",
    customInformation: "Custom Info",
  },
};
const closeChargePermissionPayload = {
  closureReason: "All actions completed",
  cancelPendingCharges: false,
};
const createChargePayload = {
  chargePermissionId: chargePermissionId,
  chargeAmount: {
    amount: "0.01",
    currencyCode: config.currencyCode,
  },
  captureNow: false,
  canHandlePendingAuthorization: false,
};
const createChargePayloadWithV2Algorithm = {
  chargePermissionId: chargePermissionIdWithV2Algorithm,
  chargeAmount: {
    amount: "0.01",
    currencyCode: config.currencyCode,
  },
  captureNow: false,
  canHandlePendingAuthorization: false,
};

const captureChargePayload = {
  captureAmount: {
    amount: "0.01",
    currencyCode: config.currencyCode,
  },
  softDescriptor: "AMZN",
};
const cancelChargePayload = {
  cancellationReason: "Cancelling Charge Test",
};

const createIndividualBusinessPayload = {
  uniqueReferenceId: "ABCD12345CB",
  ledgerCurrency: "JPY",
  businessInfo: {
    businessType: "INDIVIDUAL",
    countryOfEstablishment: "JP",
    businessLegalName: "TestingSubmerchant",
    businessAddress: {
      addressLine1: "450 Noda",
      city: "香取市",
      stateOrRegion: "千葉県",
      postalCode: "289-0314",
      countryCode: "JP",
    },
  },
};

const createCorporateBusinessPayload = {
  uniqueReferenceId: "ABCD12345CB",
  ledgerCurrency: "JPY",
  businessInfo: {
    businessType: "CORPORATE",
    countryOfEstablishment: "JP",
    businessLegalName: "TestingSubmerchant",
    businessAddress: {
      addressLine1: "450",
      addressLine2: "Noda",
      city: "香取市",
      stateOrRegion: "千葉県",
      postalCode: "289-0314",
      countryCode: "JP",
    },
  },
  primaryContactPerson: {
    personFullName: "Integration Tests",
    residentialAddress: {
      addressLine1: "4-7, Sunny Mansion 203",
      addressLine2: "Hommachi 2 choume",
      city: "Chiryushi",
      stateOrRegion: "AICHI",
      postalCode: "4720021",
      countryCode: "JP",
    },
  },
};

const createCorporateWithoutPocPayload = {
  uniqueReferenceId: "ABCD12345CB",
  ledgerCurrency: "JPY",
  businessInfo: {
    businessType: "CORPORATE",
    countryOfEstablishment: "JP",
    businessLegalName: "TestingSubmerchant",
    businessAddress: {
      addressLine1: "450",
      addressLine2: "Noda",
      city: "香取市",
      stateOrRegion: "千葉県",
      postalCode: "289-0314",
      countryCode: "JP",
    },
  },
};

const createUpdatePayload = {
  businessInfo: {
    businessAddress: {
      addressLine1: "41 Nishigamo Kitaimaharacho",
      city: "京都市",
      stateOrRegion: "京都府",
      postalCode: "603-8821",
      countryCode: "JP",
    },
  },
};

const updateChargePayload = {
  statusDetails: {
    state: "Canceled",
    reasonCode: "ExpiredUnused",
  },
};

const updateChargePayloadWithV2Algorithm = {
  statusDetails: {
    state: "Canceled",
    reasonCode: "ExpiredUnused",
  },
};

const createDisputePayload = {
  chargeId: pspChargeId,
  providerMetadata: {
    providerDisputeId: "A2CQXQ2TUSYG7J",
  },
  disputeAmount: {
    amount: "1",
    currencyCode: configWithAlgorithm.currencyCode,
  },
  filingReason: "ProductNotReceived",
  filingTimestamp: Date.now(),
  statusDetails: {
    state: "ActionRequired",
  },
  merchantResponseDeadline: Date.now() + 14 * 24 * 60 * 60 * 1000,
};

const updateDisputePayload = {
  statusDetails: {
    resolution: "MerchantWon",
    state: "Resolved",
    reasonCode: "MerchantAcceptedDispute",
    reasonDescription: "Merchant accepted the dispute request",
  },
  closureTimestamp: Date.now(),
};

const contestDisputePayload = {
  merchantEvidences: [
    {
      evidenceType: "TrackingNumber",
      fileId: "ababcbchdhdhhduathcfjhf",
      evidenceText: "raw text supporting merchant evidence",
    },
  ],
};

const uploadFilePayload = {
  type: "jpg",
  purpose: "disputeEvidence",
};

const createMerchantAccountPayload = {
  uniqueReferenceId: "Hanabii-" + uuidv4(),
  ledgerCurrency: "JPY",
  businessInfo: {
    email: "rufus-" + uuidv4() + "@abc.com",
    businessType: "CORPORATE",
    businessLegalName: "Kunal Mehta",
    businessCategory: "Beauty",
    businessDisplayName: "Rufus's Cafe",
    annualSalesVolume: {
      amount: "100000",
      currencyCode: "JPY",
    },
    countryOfEstablishment: "JP",
    businessAddress: {
      addressLine1: "4-7, Sunny Mansion 203",
      addressLine2: "Boren Ave",
      city: "Chiryushi",
      stateOrRegion: "AICHI",
      postalCode: "4720021",
      countryCode: "JP",
      phoneNumber: {
        countryCode: "81",
        number: "2062062061",
      },
    },
    customerSupportInformation: {
      customerSupportEmail: "test.merchant-" + uuidv4() + "@abc.com",
      customerSupportPhoneNumber: {
        countryCode: "1",
        number: "1234567",
        extension: "123",
      },
    },
  },
  beneficiaryOwners: [
    {
      personId: "BO1",
      personFullName: "Rufus Rufus",
      residentialAddress: {
        addressLine1: "4-7, Sunny Mansion 203",
        addressLine2: "Boren Ave",
        city: "Chiryushi",
        stateOrRegion: "AICHI",
        postalCode: "4720021",
        countryCode: "JP",
        phoneNumber: {
          countryCode: "81",
          number: "2062062061",
        },
      },
    },
  ],
  primaryContactPerson: {
    personFullName: "Rufus Rufus",
  },
  integrationInfo: {
    ipnEndpointUrls: [
      "https://cloudfront.net/ipnendpoint",
      "https://cloudfront.net/ipnendpoint",
    ],
  },
  stores: [
    {
      domainUrls: ["https://www.rufus.com"],
      storeName: "Rufus's Cafe",
      privacyPolicyUrl: "http://www.rufus.com/privacy",
      storeStatus: {
        state: "Active",
      },
    },
  ],
  merchantStatus: {
    statusProvider: "Ayden",
    state: "ACTIVE",
    reasonCode: null,
  },
};

const updateMerchantAccountPayload = {
  businessInfo: {
    email: "rufus-" + uuidv4() + "@abc.com",
    businessType: "CORPORATE",
    businessLegalName: "Kunal Mehta",
    businessCategory: "Beauty",
    businessDisplayName: "Rufus's Cafe",
    annualSalesVolume: {
      amount: "100000",
      currencyCode: "JPY",
    },
    countryOfEstablishment: "JP",
    businessAddress: {
      addressLine1: "4-7, Sunny Mansion 203",
      addressLine2: "Boren Ave",
      city: "Chiryushi",
      stateOrRegion: "AICHI",
      postalCode: "4720021",
      countryCode: "JP",
      phoneNumber: {
        countryCode: "81",
        number: "2062062061",
      },
    },
  },
};

function validateGetBuyerResponse(result) {
  assert.strictEqual(result.status, 200);
  var actualResponse = result.data;
  assert.deepStrictEqual(
    actualResponse.buyerId.startsWith("amzn1.account."),
    true,
  );
}

// Validating Checkout Session API Calls
describe("WebStore Client Test Cases - Checkout Session APIs", () => {
  before(function () {
    if (!createCheckoutSessionPayload.storeId) {
      console.error(
        "Please provide storeId in the payload before executing these test cases",
      );
      this.skip();
    }
  });

  const expectedResponse = {
    checkoutSessionId: "",
    webCheckoutDetails: "",
    productType: "",
    paymentDetails: "",
    chargePermissionType: "",
    orderType: "",
    recurringMetadata: "",
    paymentMethodOnFileMetadata: "",
    merchantDetails: "",
    merchantMetadata: "",
    supplementaryData: "",
    buyer: "",
    billingAddress: "",
    paymentPreferences: "",
    statusDetails: "",
    shippingAddress: "",
    platformId: "",
    chargePermissionId: "",
    chargeId: "",
    constraints: "",
    creationTimestamp: "",
    expirationTimestamp: "",
    storeId: "",
    providerMetadata: "",
    releaseEnvironment: "",
    checkoutButtonText: "",
    deliverySpecifications: "",
    tokens: "",
  };

  it("Validating Get Buyer API", (done) => {
    webStoreClient
      .getBuyer(buyerToken, headers)
      .then(validateGetBuyerResponse)
      .then(done)
      .catch(done);
  });

  it("Validating Get Buyer API with V2 Algorithm", (done) => {
    webStoreClientWithAlgorithm
      .getBuyer(buyerTokenWithV2Algorithm, headersWithV2Algorithm)
      .then(validateGetBuyerResponse)
      .then(done)
      .catch(done);
  });

  function validateCreateCheckoutSessionResponse(result) {
    assert.strictEqual(result.status, 201);
    var actualResponse = result.data;
    checkoutSessionId = actualResponse.checkoutSessionId;
    assert.deepStrictEqual(
      Object.keys(expectedResponse),
      Object.keys(actualResponse),
    );
  }

  it("Validating Create Checkout Session API", (done) => {
    webStoreClient
      .createCheckoutSession(createCheckoutSessionPayload, headers)
      .then(validateCreateCheckoutSessionResponse)
      .then(done)
      .catch(done);
  });

  it("Validating Create Checkout Session API with V2 Algorithm", (done) => {
    webStoreClientWithAlgorithm
      .createCheckoutSession(
        createCheckoutSessionPayload,
        headersWithV2Algorithm,
      )
      .then(validateCreateCheckoutSessionResponse)
      .then(done)
      .catch(done);
  });

  it("Validating Get Checkout Session API", (done) => {
    webStoreClient
      .getCheckoutSession(checkoutSessionId, headers)
      .then(validateCheckoutSessionResponse)
      .then(done)
      .catch(done);
  });

  it("Validating Get Checkout Session API with V2 Algorithm", (done) => {
    webStoreClientWithAlgorithm
      .getCheckoutSession(checkoutSessionId, headersWithV2Algorithm)
      .then(validateCheckoutSessionResponse)
      .then(done)
      .catch(done);
  });

  it("Validating Update Checkout Session API", (done) => {
    webStoreClient
      .updateCheckoutSession(checkoutSessionId, updateCheckoutSessionPayload)
      .then(validateCheckoutSessionResponse)
      .then(done)
      .catch(done);
  });

  it("Validating Update Checkout Session API with V2 Algorithm", (done) => {
    webStoreClientWithAlgorithm
      .updateCheckoutSession(checkoutSessionId, updateCheckoutSessionPayload)
      .then(validateCheckoutSessionResponse)
      .then(done)
      .catch(done);
  });

  // Can only run this after visiting amazonPayRedirectUrl
  it.skip("Validating Complete Checkout Session API", (done) => {
    webStoreClient
      .completeCheckoutSession(
        checkoutSessionId,
        completeCheckoutSessionPayload,
      )
      .then(validateCheckoutSessionResponse)
      .then(done)
      .catch(done);
  });

  // Can only run this after visiting amazonPayRedirectUrl
  it.skip("Validating Complete Checkout Session API With V2 Algorithm", (done) => {
    webStoreClient
      .completeCheckoutSession(
        checkoutSessionId,
        completeCheckoutSessionPayload,
      )
      .then(validateCheckoutSessionResponse)
      .then(done)
      .catch(done);
  });

  function validateCheckoutSessionResponse(result) {
    assert.strictEqual(result.status, 200);
    var actualResponse = result.data;
    assert.deepStrictEqual(
      Object.keys(expectedResponse),
      Object.keys(actualResponse),
    );
  }
});

describe("WebStore Client Test Cases - Finalize Checkout Session APIs", () => {
  before(function () {
    if (
      !finalizeCheckoutSessionId &&
      !finalizeCheckoutSessionIdWithV2Algorithm
    ) {
      console.error(
        "Please provide finalize checkout session id before executing these test cases",
      );
      this.skip();
    }
  });

  const expectedResponse = {
    checkoutSessionId: "",
    webCheckoutDetails: "",
    productType: "",
    paymentDetails: "",
    cartDetails: "",
    chargePermissionType: "",
    orderType: "",
    recurringMetadata: "",
    paymentMethodOnFileMetadata: "",
    merchantDetails: "",
    merchantMetadata: "",
    supplementaryData: "",
    buyer: "",
    billingAddress: "",
    paymentPreferences: "",
    statusDetails: "",
    shippingAddress: "",
    platformId: "",
    chargePermissionId: "",
    chargeId: "",
    constraints: "",
    creationTimestamp: "",
    expirationTimestamp: "",
    storeId: "",
    providerMetadata: "",
    releaseEnvironment: "",
    checkoutButtonText: "",
    deliverySpecifications: "",
    tokens: "",
  };

  function validateCheckoutSessionResponse(result) {
    assert.strictEqual(result.status, 200);
    var actualResponse = result.data;
    assert.deepStrictEqual(
      Object.keys(expectedResponse),
      Object.keys(actualResponse),
    );
  }

  // Test for finalizeCheckoutSession with V1 Algorithm
  it("Validating Finalize Checkout Session API", (done) => {
    webStoreClient
      .finalizeCheckoutSession(
        finalizeCheckoutSessionId,
        finalizeCheckoutSessionPayload,
      )
      .then(validateCheckoutSessionResponse)
      .then(done)
      .catch(done);
  });

  // Test for finalizeCheckoutSession with V2 Algorithm
  it("Validating Finalize Checkout Session API With V2 Algorithm", (done) => {
    webStoreClient
      .finalizeCheckoutSession(
        finalizeCheckoutSessionIdWithV2Algorithm,
        finalizeCheckoutSessionPayload,
      )
      .then(validateCheckoutSessionResponse)
      .then(done)
      .catch(done);
  });
});

describe("", () => {
  // Skip the tests if chargePermissionId is not provided
  before(function () {
    if (!chargePermissionId && !chargePermissionIdWithV2Algorithm) {
      console.error(
        "Please provide chargePermissionId before executing these test cases",
      );
      this.skip();
    }
  });

  // Validating Charge Permission API Call's
  describe("WebStore Client Test Cases - Charge Permission APIs", (done) => {
    const expectedResponseKeys = [
      "chargePermissionId",
      "chargePermissionReferenceId:",
      "platformId",
      "buyer",
      "shippingAddress",
      "billingAddress",
      "paymentPreferences",
      "statusDetails",
      "creationTimestamp",
      "expirationTimestamp",
      "merchantMetadata",
      "releaseEnvironment",
      "limits",
      "chargePermissionType",
      "recurringMetadata",
      "presentmentCurrency",
    ];

    function validateChargePermissionResponse(result) {
      assert.strictEqual(result.status, 200);
      var actualResponse = result.data;
      expectedResponseKeys.forEach((key) => {
        assert.ok(actualResponse.hasOwnProperty(key), `Missing key: ${key}`);
      });
    }

    it("Validating Get Charge Permission API", (done) => {
      webStoreClient
        .getChargePermission(chargePermissionId, headers)
        .then(validateChargePermissionResponse)
        .then(done)
        .catch(done);
    });

    it("Validating Get Charge Permission API with V2 Algorithm", (done) => {
      webStoreClientWithAlgorithm
        .getChargePermission(
          chargePermissionIdWithV2Algorithm,
          headersWithV2Algorithm,
        )
        .then(validateChargePermissionResponse)
        .then(done)
        .catch(done);
    });

    it("Validating Update Charge Permission API", (done) => {
      webStoreClient
        .updateChargePermission(
          chargePermissionId,
          updateChargePermissionPayload,
          headers,
        )
        .then(validateChargePermissionResponse)
        .then(done)
        .catch(done);
    });

    it("Validating Update Charge Permission API with V2 Algorithm", (done) => {
      webStoreClientWithAlgorithm
        .updateChargePermission(
          chargePermissionIdWithV2Algorithm,
          updateChargePermissionPayload,
          headersWithV2Algorithm,
        )
        .then(validateChargePermissionResponse)
        .then(done)
        .catch(done);
    });

    // Cannot Create Charge if Close Charge Permission is executed, unskip this test case and skip Charge API Tests to validate this API
    it.skip("Validating Close Charge Permission API", (done) => {
      webStoreClient
        .closeChargePermission(
          chargePermissionId,
          closeChargePermissionPayload,
          headers,
        )
        .then(validateChargePermissionResponse)
        .then(done)
        .catch(done);
    });

    it.skip("Validating Close Charge Permission API with V2 Algorithm", (done) => {
      webStoreClient
        .closeChargePermission(
          chargePermissionIdWithV2Algorithm,
          closeChargePermissionPayload,
          headersWithV2Algorithm,
        )
        .then(validateChargePermissionResponse)
        .then(done)
        .catch(done);
    });
  });

  // Validating Create Charge API Call
  describe("WebStore Client Test Cases - Charge APIs", (done) => {
    const expectedResponseKeys = [
      "chargeId",
      "chargeAmount",
      "chargePermissionId",
      "captureAmount",
      "refundedAmount",
      "softDescriptor",
      "providerMetadata",
      "convertedAmount",
      "conversionRate",
      "channel",
      "chargeInitiator",
      "statusDetails",
      "creationTimestamp",
      "expirationTimestamp",
      "releaseEnvironment",
      "merchantMetadata",
      "platformId",
      "webCheckoutDetails",
    ];

    before(function () {
      if (!chargePermissionId && !chargePermissionIdWithV2Algorithm) {
        console.error("Please Enter chargePermissionId and execute test cases");
        this.skip();
      }
    });

    function validateCreateChargeResponse(result) {
      assert.strictEqual(result.status, 201);
      var actualResponse = result.data;
      chargeId = actualResponse.chargeId;
      expectedResponseKeys.forEach((key) => {
        assert.ok(actualResponse.hasOwnProperty(key), `Missing key: ${key}`);
      });
    }

    it("Validating Create Charge API", (done) => {
      webStoreClient
        .createCharge(createChargePayload, headers)
        .then(validateCreateChargeResponse)
        .then(done)
        .catch(done);
    });

    it("Validating Create Charge API with V2 Algorithm", (done) => {
      webStoreClientWithAlgorithm
        .createCharge(
          createChargePayloadWithV2Algorithm,
          headersWithV2Algorithm,
        )
        .then(validateCreateChargeResponse)
        .then(done)
        .catch(done);
    });

    function validateChargeResponse(result) {
      assert.strictEqual(result.status, 200);
      var actualResponse = result.data;
      expectedResponseKeys.forEach((key) => {
        assert.ok(actualResponse.hasOwnProperty(key), `Missing key: ${key}`);
      });
    }

    it("Validating Get Charge API", (done) => {
      webStoreClient
        .getCharge(chargeId, headers)
        .then(validateChargeResponse)
        .then(done)
        .catch(done);
    });

    it("Validating Get Charge API with V2 Algorithm", (done) => {
      webStoreClientWithAlgorithm
        .getCharge(chargeId, headersWithV2Algorithm)
        .then(validateChargeResponse)
        .then(done)
        .catch(done);
    });

    it("Validating Update Charge API", (done) => {
      webStoreClient
        .updateCharge(pspChargeId, updateChargePayload, headers)
        .then(validateChargeResponse)
        .then(done)
        .catch(done);
    });

    it("Validating Update Charge API with V2 Algorithm", (done) => {
      webStoreClientWithAlgorithm
        .updateCharge(
          pspChargeIdWithV2Algorithm,
          updateChargePayloadWithV2Algorithm,
          headersWithV2Algorithm,
        )
        .then(validateChargeResponse)
        .then(done)
        .catch(done);
    });

    it("Validating Capture Charge API", (done) => {
      webStoreClient
        .captureCharge(chargeId, captureChargePayload, headers)
        .then(validateChargeResponse)
        .then(done)
        .catch(done);
    });

    it("Validating Capture Charge API with V2 Algorithm", (done) => {
      webStoreClientWithAlgorithm
        .captureCharge(chargeId, captureChargePayload, headers)
        .then(validateChargeResponse)
        .then(done)
        .catch(done);
    });

    // Cannot Run both Capture charge and Cancel charge at same time, Run either Capture Capture or Cancel Charge
    it.skip("Validating Cancel Charge API", (done) => {
      webStoreClient
        .cancelCharge(chargeId, cancelChargePayload, headers)
        .then(validateChargeResponse)
        .then(done)
        .catch(done);
    });

    // Cannot Run both Capture charge and Cancel charge at same time, Run either Capture Capture or Cancel Charge
    it.skip("Validating Cancel Charge API with V2 Algorithm", (done) => {
      webStoreClientWithAlgorithm
        .cancelCharge(
          chargeIdWithV2Algorithm,
          cancelChargePayload,
          headersWithV2Algorithm,
        )
        .then(validateChargeResponse)
        .then(done)
        .catch(done);
    });
  });

  //Validating Refund API Call's
  describe("WebStore Client Test Cases - Refund APIs", (done) => {
    // Refund API should have different idempotency key, Hence creating new headers
    const headers = {
      "x-amz-pay-idempotency-key": uuidv4().toString().replace(/-/g, ""),
    };
    const expectedResponseKeys = [
      "refundId",
      "chargeId",
      "creationTimestamp",
      "refundAmount",
      "statusDetails",
      "softDescriptor",
      "releaseEnvironment",
    ];

    before(function () {
      if (!chargePermissionId && !chargePermissionIdWithV2Algorithm) {
        console.error("Please Enter chargePermissionId and execute test cases");
        this.skip();
      }
    });

    function validatCreateRefundResponse(result) {
      assert.strictEqual(result.status, 201);
      var actualResponse = result.data;
      refundId = actualResponse.refundId;
      expectedResponseKeys.forEach((key) => {
        assert.ok(actualResponse.hasOwnProperty(key), `Missing key: ${key}`);
      });
    }

    it("Validating Create Refund API", (done) => {
      const refundPayload = {
        chargeId: chargeId,
        refundAmount: {
          amount: "0.01",
          currencyCode: config.currencyCode,
        },
        softDescriptor: "SOFT_DESCRIPTOR",
      };
      webStoreClient
        .createRefund(refundPayload, headers)
        .then(validatCreateRefundResponse)
        .then(done)
        .catch(done);
    });

    it("Validating Create Refund API with V2 Algorithm", (done) => {
      const refundPayload = {
        chargeId: chargeId,
        refundAmount: {
          amount: "0.01",
          currencyCode: config.currencyCode,
        },
        softDescriptor: "SOFT_DESCRIPTOR",
      };
      webStoreClientWithAlgorithm
        .createRefund(refundPayload, headers)
        .then(validatCreateRefundResponse)
        .then(done)
        .catch(done);
    });

    function validatGetRefundResponse(result) {
      assert.strictEqual(result.status, 200);
      var actualResponse = result.data;
      Object.keys(expectedResponse).forEach((key) => {
        assert.ok(actualResponse.hasOwnProperty(key), `Missing key: ${key}`);
      });
    }

    it("Validating Get Refund API", (done) => {
      webStoreClient
        .getRefund(refundId, headers)
        .then(validatGetRefundResponse)
        .then(done)
        .catch(done);
    });

    it("Validating Get Refund API with V2 Algorithm", (done) => {
      webStoreClientWithAlgorithm
        .getRefund(refundId, headers)
        .then(validatGetRefundResponse)
        .then(done)
        .catch(done);
    });
  });

  // ------------ Testing the CV2 Reporting APIs ---------------
  describe("WebStore Client Test Cases - CV2 Reporting APIs", (done) => {
    const startTime = "20230618T150630Z";
    const endTime = "20230911T150350Z";

    const expectGetReportResponse = {
      createdTime: "",
      endTime: "",
      processingEndTime: "",
      processingStartTime: "",
      processingStatus: "",
      reportDocumentId: "",
      reportId: "",
      reportType: "",
      startTime: "",
    };

    const expectGetReportSchedulesReponse = {
      nextReportCreationTime: "",
      reportScheduleId: "",
      reportType: "",
      scheduleFrequency: "",
    };

    // Tests the GetReports API
    it("Validating Get Report API", (done) => {
      const requestPayload = {
        reportType: "",
        processingStatus: "",
        createdSince: startTime,
        createdUntil: endTime,
        pageSize: "10",
      };
      webStoreClient
        .getReports()
        .then(function (result) {
          assert.strictEqual(result.status, 200);
          var response = result.data;
          var reports = response["reports"];
          assert.deepStrictEqual(
            Object.keys(expectGetReportResponse),
            Object.keys(reports[0]),
          );
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    // Tests the GetReportById API
    it("Validating Get Report By Id API", (done) => {
      const reportId = "59007019641";
      webStoreClient
        .getReportById(reportId, headers)
        .then(function (result) {
          assert.strictEqual(result.status, 200);
          var response = result.data;
          assert.deepStrictEqual(
            Object.keys(expectGetReportResponse),
            Object.keys(response),
          );
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    // Cannot test GerReportDocument right now, as it deals with Settlement reports which are not supported in our accounts
    // Tests Get Report Document API
    // it('Validating Get Report Document API', (done) => {
    //     const reportDocumentId = '61516019327';
    //     webStoreClient.getReportDocument(reportDocumentId, headers).then(function (result) {
    //         assert.strictEqual(result.status, 200);
    //         var response = result.data;
    //         assert.deepStrictEqual(Object.keys(expectGetReportResponse), Object.keys(response));
    //         done();
    //     }).catch(err => {
    //         done(err);
    //     });
    // });

    // Tests Get Report Schedules API
    it("Validating Create Report Schedule API", (done) => {
      const requestPayload = {
        reportType: "_GET_FLAT_FILE_OFFAMAZONPAYMENTS_AUTHORIZATION_DATA_",
        scheduleFrequency: "PT84H",
        nextReportCreationTime: startTime,
        deleteExistingSchedule: true,
      };
      webStoreClient
        .createReportSchedule(requestPayload, headers)
        .then(function (result) {
          assert.strictEqual(result.status, 201);
          var response = result.data;
          reportScheduleId = response["reportScheduleId"];
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it("Validating Get Report Schedules API", (done) => {
      const reportTypes =
        "_GET_FLAT_FILE_OFFAMAZONPAYMENTS_AUTHORIZATION_DATA_,_GET_FLAT_FILE_OFFAMAZONPAYMENTS_BILLING_AGREEMENT_DATA_";
      webStoreClient
        .getReportSchedules(reportTypes, headers)
        .then(function (result) {
          assert.strictEqual(result.status, 200);
          var response = result.data;
          var reportSchedules = response["reportSchedules"];
          assert.deepStrictEqual(
            Object.keys(expectGetReportSchedulesReponse),
            Object.keys(reportSchedules[0]),
          );
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    // Tests Get Report Schedule by Id API
    it("Validating Get Report Schedule by Id API", (done) => {
      webStoreClient
        .getReportScheduleById(reportScheduleId, headers)
        .then(function (result) {
          assert.strictEqual(result.status, 200);
          var response = result.data;
          assert.deepStrictEqual(
            Object.keys(expectGetReportSchedulesReponse),
            Object.keys(response),
          );
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    // Tests Create Report API
    it("Validating Create Report API", (done) => {
      const requestPayload = {
        reportType: "_GET_FLAT_FILE_OFFAMAZONPAYMENTS_AUTHORIZATION_DATA_",
        startTime: startTime,
        endTime: endTime,
      };
      webStoreClient
        .createReport(requestPayload, headers)
        .then(function (result) {
          assert.strictEqual(result.status, 201);
          var response = result.data;
          var reportId = response["reportId"];
          assert.ok(reportId !== null);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    // Tests Create and Cancel ReportSchedule API
    it("Validating Create Report Schedule API and Cancel Report Schedule API", (done) => {
      const requestPayload = {
        reportType: "_GET_FLAT_FILE_OFFAMAZONPAYMENTS_AUTHORIZATION_DATA_",
        scheduleFrequency: "PT84H",
        nextReportCreationTime: startTime,
        deleteExistingSchedule: true,
      };
      webStoreClient
        .createReportSchedule(requestPayload, headers)
        .then(function (result) {
          assert.strictEqual(result.status, 201);
          var response = result.data;
          var reportScheduleId = response["reportScheduleId"];
          assert.ok(reportScheduleId !== null);

          webStoreClient
            .cancelReportSchedule(reportScheduleId)
            .then(function (resuLt) {
              assert.strictEqual(resuLt.status, 200);
            })
            .catch((err) => {
              done(err);
            });

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  // ------------ Testing the Merchant Onboarding & Account Management APIs for Authorised Merchants ---------------

  describe("WebStore Client Test Cases - Merchant Onboarding & Account Management APIs for Authorised Merchants ", (done) => {
    const expectedAmazonPayAccountResponse = {
      uniqueReferenceId: "",
      merchantAccountId: "",
    };

    function validateRegisterAmazonPayResponse(result) {
      assert.strictEqual(result.status, 201);
      var actualResponse = result.data;
      merchantAccountId = actualResponse.merchantAccountId;
      assert.deepStrictEqual(
        Object.keys(expectedAmazonPayAccountResponse),
        Object.keys(actualResponse),
      );
    }

    function validateDeleteAmazonPayAccountResponse(result) {
      assert.strictEqual(result.status, 202);
    }

    function validateUpdateAmazonPayAccountResponse(result) {
      assert.strictEqual(result.status, 204);
    }

    // Validating Register, Update and Delete Amazon Pay Account APIs
    function amazonPayAccountOperations(payload) {
      return webStoreClient
        .registerAmazonPayAccount(payload, headers)
        .then(validateRegisterAmazonPayResponse)
        .then(() =>
          webStoreClient.updateAmazonPayAccount(
            merchantAccountId,
            createUpdatePayload,
          ),
        )
        .then(validateUpdateAmazonPayAccountResponse)
        .then(() => webStoreClient.deleteAmazonPayAccount(merchantAccountId))
        .then(validateDeleteAmazonPayAccountResponse);
    }

    const testAmazonPayAccountOperations = (payload, businessType) => {
      it(`Validating Register Amazon Pay Account API with ${businessType}`, (done) => {
        amazonPayAccountOperations(payload).then(done).catch(done);
      });
    };

    testAmazonPayAccountOperations(
      createIndividualBusinessPayload,
      "Individual Business Type",
    );
    testAmazonPayAccountOperations(
      createCorporateBusinessPayload,
      "Corporate Business Type and with Poc",
    );
    testAmazonPayAccountOperations(
      createCorporateWithoutPocPayload,
      "Corporate Business Type and without Poc",
    );
  });

  // ------------ Testing the Merchant Onboarding & Account Management APIs for Authorised Solution Providers ---------------

  describe("WebStore Client Test Cases - Merchant Onboarding & Account Management APIs for Authorised Solution Providers ", (done) => {
    const expectedMerchantAccountResponseKeys = [
      "uniqueReferenceId",
      "merchantAccountId",
    ];

    function validateResponse(result, expectedStatus) {
      assert.strictEqual(result.status, expectedStatus);
      const actualResponse = result.data;
      expectedMerchantAccountResponseKeys.forEach((key) => {
        assert.ok(actualResponse.hasOwnProperty(key), `Missing key: ${key}`);
      });
      return actualResponse;
    }

    function validateCreateMerchantAccountResponse(result) {
      const actualResponse = validateResponse(result, 201);
      merchantAccountId = actualResponse.merchantAccountId;
      uniqueReferenceId = actualResponse.uniqueReferenceId;
      authorizationToken = actualResponse.authorizationToken;
    }

    function validateUpdateMerchantAccountResponse(result) {
      validateResponse(result, 200);
    }

    function validateMerchantAccountClaimResponse(result) {
      validateResponse(result, 303);
    }

    it("Validating createMerchantAccount API", (done) => {
      webStoreClient
        .createMerchantAccount(createMerchantAccountPayload)
        .then(validateCreateMerchantAccountResponse)
        .then(done)
        .catch(done);
    });

    it("Validating updateMerchantAccount API", (done) => {
      const headers = {
        "x-amz-pay-authtoken": authorizationToken,
      };

      webStoreClient
        .updateMerchantAccount(
          merchantAccountId,
          updateMerchantAccountPayload,
          headers,
        )
        .then(validateUpdateMerchantAccountResponse)
        .then(done)
        .catch(done);
    });

    it("Validating merchantAccountClaim API", (done) => {
      const merchantAccountClaimPayload = {
        uniqueReferenceId: uniqueReferenceId,
      };

      webStoreClient
        .merchantAccountClaim(merchantAccountId, merchantAccountClaimPayload)
        .then(validateMerchantAccountClaimResponse)
        .then(done)
        .catch(done);
    });
  });

  // ------------ Testing the Disputes APIs ---------------

  describe("WebStore Client Test Cases - Disputes APIs", (done) => {
    before(function () {
      if (!pspChargeId && !pspChargeIdWithV2Algorithm) {
        console.error(
          "Please provide PSP chargeId before executing these test cases",
        );
        this.skip();
      }
    });

    const expectedDisputeResponseKeys = [
      "disputeId",
      "chargeId",
      "disputeType",
      "disputeAmount",
      "filingReason",
      "resolutionAuthority",
      "statusDetails",
      "merchantResponseDeadline",
      "releaseEnvironment",
    ];

    function validateDisputeAPIResponse(result) {
      assert.strictEqual(result.status, 200);
      var actualResponse = result.data;
      disputeId = actualResponse.disputeId;
      expectedDisputeResponseKeys.forEach((key) => {
        assert.ok(actualResponse.hasOwnProperty(key), `Missing key: ${key}`);
      });
    }

    it("Validating createDispute API", (done) => {
      webStoreClient
        .createDispute(createDisputePayload, headers)
        .then(validateDisputeAPIResponse)
        .then(done)
        .catch(done);
    });

    it("Validating getDispute API", (done) => {
      webStoreClient
        .getDispute(disputeId, headers)
        .then(validateDisputeAPIResponse)
        .then(done)
        .catch(done);
    });

    it("Validating updateDispute API", (done) => {
      webStoreClient
        .updateDispute(disputeId, updateDisputePayload, headers)
        .then(validateDisputeAPIResponse)
        .then(done)
        .catch(done);
    });

    it("Validating contestDispute API", (done) => {
      webStoreClient
        .contestDispute(disputeId, contestDisputePayload, headers)
        .then(validateDisputeAPIResponse)
        .then(done)
        .catch(done);
    });
  });

  // ------------ Testing the File APIs ---------------

  describe("WebStore Client Test Cases - File APIs", (done) => {
    const expectedFileAPIResponseKeys = [
      "id",
      "type",
      "purpose",
      "url",
      "size",
      "uploadTimestamp",
      "urlExpirationTimestamp",
    ];

    function validateFileAPIResponse(result) {
      assert.strictEqual(result.status, 200);
      var actualResponse = result.data;
      expectedFileAPIResponseKeys.forEach((key) => {
        assert.ok(actualResponse.hasOwnProperty(key), `Missing key: ${key}`);
      });
    }

    it("Validating FileUpload API", (done) => {
      webStoreClient
        .uploadFile(uploadFilePayload, headers)
        .then(validateFileAPIResponse)
        .then(done)
        .catch(done);
    });
  });
});

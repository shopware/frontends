# Amazon Pay API SDK (Node.js)
Amazon Pay Checkout v2 Integration

Please note the Amazon Pay API SDK can only be used for API calls to the pay-api.amazon.com|eu|jp endpoint.

## Requirements

* Amazon Pay account: To register for Amazon Pay, go to https://pay.amazon.com, choose your region by selecting the flag icon in the upper right corner, and then click "Register".
* Node 8.0 or higher

## Install

To use this module directly, install it as a dependency:

```
npm i @amazonpay/amazon-pay-api-sdk-nodejs
```

## Public and Private Keys

MWS access keys, MWS secret keys, and MWS authorization tokens from previous MWS integrations cannot be used with this SDK.

You will need to generate your own public/private key pair to make API calls with this SDK.

In Windows 10 this can be done with ssh-keygen commands:

```
ssh-keygen -t rsa -b 2048 -f private.pem
ssh-keygen -f private.pem -e -m PKCS8 > public.pub
```

In Linux or macOS this can be done using openssl commands:

```
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout > public.pub
```

The first command above generates a private key and the second line uses the private key to generate a public key.

To associate the key with your account, follow the instructions here to
[Get your Public Key ID](https://developer.amazon.com/docs/amazon-pay-checkout/get-set-up-for-integration.html#5-get-your-public-key-id).

## Configuration

``` js
    const fs = require('fs');
    const config = {
        'publicKeyId': 'ABC123DEF456XYZ',                 // RSA Public Key ID (this is not the Merchant or Seller ID)
        'privateKey': fs.readFileSync('tst/private.pem'), // Path to RSA Private Key (or a string representation)
        'region': 'us',                                   // Must be one of: 'us', 'eu', 'jp' 
        'sandbox': true,                                   // true (Sandbox) or false (Production) boolean
        'algorithm': 'AMZN-PAY-RSASSA-PSS-V2'             // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };
```

If you have created environment specific keys (i.e Public Key Starts with LIVE or SANDBOX) in Seller Central, then use those PublicKeyId & PrivateKey. In this case, there is no need to pass the Sandbox parameter to the ApiConfiguration.

``` js
    const fs = require('fs');
    const config = {
        'publicKeyId': 'PUBLIC_KEY_ID',                   // LIVE-XXXXX or SANDBOX-XXXXX
        'privateKey': fs.readFileSync('tst/private.pem'), // Path to RSA Private Key (or a string representation)
        'region': 'us',                                   // Must be one of: 'us', 'eu', 'jp' 
        'algorithm': 'AMZN-PAY-RSASSA-PSS-V2'             // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };
```

# Versioning
The pay-api.amazon.com|eu|jp endpoint uses versioning to allow future updates. The major version of this SDK will stay aligned with the API version of the endpoint.

If you have downloaded version 2.x.y of this SDK, version in below examples would be "v2".

# Convenience Functions (Overview)

Make use of the built-in convenience functions to easily make API calls.  Scroll down further to see example code snippets.

When using the convenience functions, the request payload will be signed using the provided private key, and a HTTPS request is made to the correct regional endpoint.
In the event of request throttling, the HTTPS call will be attempted up to three times

## Alexa Delivery Trackers API
Please note that your merchant account must be whitelisted to use the [Delivery Trackers API](https://developer.amazon.com/docs/amazon-pay-onetime/delivery-order-notifications.html).

* **deliveryTrackers**(payload, headers = null) &#8594; POST to `${version}/deliveryTrackers`

## Authorization Tokens API
Please note that your solution provider account must have a pre-existing relationship (valid and active MWS authorization token) with the merchant account in order to use this function.

* **getAuthorizationToken**(mwsAuthToken, merchantId, headers = null) &#8594; GET to `${version}/authorizationTokens/${mwsAuthToken}?merchantId=${merchantId}`

## Amazon Checkout v2 API
[Checkout v2 Integration Guide](https://developer.amazon.com/docs/amazon-pay-api-v2/introduction.html)

The headers field is not optional for create/POST calls below because it requires, at a minimum, the x-amz-pay-idempotency-key header:

``` js
    const headers = {
        'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
    };
```

### Amazon Checkout v2 Buyer APIs
* **getBuyer**($buyerToken, $headers = null) &#8594; GET to `${version}/buyer/{$buyerToken}`

### Checkout v2 CheckoutSession APIs
* **createCheckoutSession**(payload, headers) &#8594; POST to `${version}/checkoutSessions`
* **getCheckoutSession**(checkoutSessionId, headers = null) &#8594; GET to `${version}/checkoutSessions/${checkoutSessionId}`
* **updateCheckoutSession**(checkoutSessionId, payload, headers = null) &#8594; PATCH to `${version}/checkoutSessions/${checkoutSessionId}`
* **completeCheckoutSession**(checkoutSessionId, payload, headers = null) &#8594; POST to `${version}/checkoutSessions/${checkoutSessionId}/complete`

### Checkout v2 ChargePermission APIs
* **getChargePermission**(chargePermissionId, headers = null) &#8594; GET to `${version}/chargePermissions/${chargePermissionId}`
* **updateChargePermission**(chargePermissionId, payload, headers = null) &#8594; PATCH to `${version}/chargePermissions/${chargePermissionId}`
* **closeChargePermission**(chargePermissionId, payload, headers = null) &#8594; DELETE to `${version}/chargePermissions/${chargePermissionId}/close`

### Checkout v2 Charge APIs
* **createCharge**(payload, headers) &#8594; POST to `${version}/charges`
* **getCharge**(chargeId, headers = null) &#8594; GET to `${version}/charges/${chargeId}`
* **updateCharge** (chargeId, payload, headers = null) &#8594; PATCH `${version}/charges/${chargeId}`
* **captureCharge**(chargeId, payload, headers) &#8594; POST to `${version}/charges/${chargeId}/capture`
* **cancelCharge**(chargeId, payload, headers = null) &#8594; DELETE to `${version}/charges/${chargeId}/cancel`

### Checkout v2 Refund APIs
* **createRefund**(payload, headers) &#8594; POST to `${version}/refunds`
* **getRefund**(refundId, headers = null) &#8594; GET to `${version}/refunds/${refundId}`

## In-Store API
Please contact your Amazon Pay Account Manager before using the In-Store API calls in a Production environment to obtain a copy of the In-Store Integration Guide.

* **instoreMerchantScan**(payload, headers = null) &#8594; POST to `${version}/in-store/merchantScan`
* **instoreCharge**(payload, headers = null) &#8594; POST to `${version}/in-store/charge`
* **instoreRefund**(payload, headers = null) &#8594; POST to `${version}/in-store/refund`

### Amazon Checkout v2 SPC
* **finalizeCheckoutSession**(checkoutSessionId, payload, headers = null) &#8594; POST to `${version}/checkoutSessions/${checkoutSessionId}/finalize`

### Amazon Checkout v2 Merchant Onboarding & Account Management APIs for Authorised Merchants
* **registerAmazonPayAccount**(payload, headers = null) &#8594; POST to `${version}/merchantAccounts`
* **updateAmazonPayAccount**(merchantAccountId, payload, headers = null) &#8594; PATCH to `${version}/merchantAccounts/${merchantAccountId}`
* **deleteAmazonPayAccount**(merchantAccountId, headers = null) &#8594; DELETE to `${version}/merchantAccounts/${merchantAccountId}`

### Amazon Checkout v2 Dispute APIs

* **createDispute**(payload,headers) &#8594; POST to `${version}/disputes`
* **getDispute**(disputeId,headers= null) &#8594; GET to `${version}/disputes/${disputeId}`
* **updateDispute**(disputeId,payload,headers = null) &#8594; PATCH to `${version}/disputes/${disputeId}`
* **contestDispute**(disputeId, payload, headers= null) &#8594; POST to `${version}/disputes/${disputeId}/contest`

### Amazon Checkout v2 File APIs
* **uploadFile**($payload,headers) &#8594; POST to `${version}/files`

### Amazon Checkout v2 Merchant Onboarding & Account Management APIs for Authorised Solution Providers
* **createMerchantAccount**(payload, headers = null) &#8594 POST to `${version}/merchantAccounts`
* **updateMerchantAccount**(merchantAccountId, payload, headers) &#8594 PATCH to `${version}/merchantAccounts/${merchantAccountId}`
* **merchantAccountClaim**(merchantAccountId, payload, headers) &#8594 POST to `${version}/merchantAccounts/${merchantAccountId}/claim`

# Using Convenience Functions

Four quick steps are needed to make an API call:

Step 1. Construct a Client (using the previously defined Config object).

``` js
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const testPayClient = new Client.AmazonPayClient(config);
    // -or-
    const testPayClient = new Client.WebStoreClient(config);
    // -or-
    const testPayClient = new Client.InStoreClient(config);
```

Step 2. Generate the payload.

``` js
    const payload = {
        scanData: 'UKhrmatMeKdlfY6b',
        scanReferenceId: uuidv4().toString().replace(/-/g, ''),
        merchantCOE: 'US',
        ledgerCurrency: 'USD',
        chargeTotal: {
            currencyCode: 'USD',
            amount: '2.00'
        },
        storeLocation: {
            countryCode: 'US'
        },
        metadata: {
            merchantNote: 'Merchant Name',
            customInformation: 'in-store Software Purchase',
            communicationContext: {
                merchantStoreName: 'Store Name',
                merchantOrderId: '789123'
            }
        }
    };
```

Step 3. Execute the call.

``` js
     const response = testPayClient.merchantScan(payload);
```

If you are a Solution Provider and need to make an API call on behalf of a different merchant account, you will need to pass along an extra authentication token parameter into the API call.
``` js
    const testHeaders = {
        'x-amz-pay-authtoken': 'other_merchant_super_secret_token'
    };
    const response = testpayClient.merchantScan(payload, testHeaders);
```

# Convenience Functions Code Samples

## Alexa Delivery Notifications

``` js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'ABC123DEF456XYZ',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'us',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified 
    };

    const payload = {
        amazonOrderReferenceId: 'P00-0000000-0000000',
        deliveryDetails: [{
            trackingNumber: '1Z999AA10123456789',
            carrierCode: 'UPS'
        }]
    };

    const testPayClient = new Client.AmazonPayClient(config);
    testPayClient.deliveryTrackers(payload).then((apiResponse) => {
        const response = apiResponse;
    });
```

## Checkout v2 - Create Checkout Session

``` js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        webCheckoutDetails: {
            checkoutReviewReturnUrl: 'https://localhost/store/checkoutReview',
            checkoutResultReturnUrl: 'https://localhost/store/checkoutReturn'
        },
        storeId: 'amzn1.application-oa2-client.5cc4962582fd4025a2962fc5350582d9' // Enter Client ID
    };
    const headers = {
        'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
    };

    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.createCheckoutSession(payload, headers);

    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Checkout v2 - Get Checkout Session

``` js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const checkoutSessionId = "00000000-0000-0000-0000-000000000000";
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.getCheckoutSession(checkoutSessionId);

    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Checkout v2 - Update Checkout Session

``` js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        webCheckoutDetails: {
            checkoutResultReturnUrl: 'https://localhost/store/checkoutReturn'
        },
        paymentDetails: {
            paymentIntent: 'Confirm',
            canHandlePendingAuthorization: false,
            chargeAmount: {
                amount: 50,
                currencyCode: 'USD'
            }
        },
        merchantMetadata: {
            merchantReferenceId: uuidv4().toString().replace(/-/g, ''),
            merchantStoreName: 'AmazonTestStoreFront',
            noteToBuyer: 'merchantNoteForBuyer',
            customInformation: ''
        }
    };

    const checkoutSessionId = "00000000-0000-0000-0000-000000000000";
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.updateCheckoutSession(checkoutSessionId, payload);

    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Checkout v2 - Complete Checkout Session

``` js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        "chargeAmount": {
            "amount": "1.23",
            "currencyCode": "USD"
        }
    };

    const checkoutSessionId = "00000000-0000-0000-0000-000000000000";
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.completeCheckoutSession(checkoutSessionId, payload);

    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```


## Checkout v2 - Get Charge Permission API
```js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const chargePermissionId = "S01-0000000-0000000";
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.getChargePermission(chargePermissionId);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Checkout v2 - Update Charge Permission API
```js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const chargePermissionId = "S01-0000000-0000000";
    const payload = {
        merchantMetadata: {
            merchantReferenceId: "32-41-323141-32",
            merchantStoreName: "AmazonTestStoreFront",
            noteToBuyer: "Some Note to buyer",
            customInformation: ""
        }
    };

    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.updateChargePermission(chargePermissionId, payload);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Checkout v2 - Close Charge Permission API
```js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const chargePermissionId = "S01-0000000-0000000";
    const payload = {
        closureReason: "No more charges required",
        cancelPendingCharges: false
    };

    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.closeChargePermission(chargePermissionId, payload);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Checkout v2 - Create Charge API
```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        chargePermissionId: "S01-0000000-0000000",
        chargeAmount: {
            amount: "14.00",
            currencyCode: "USD"
        },
        captureNow: true,
        softDescriptor: "Descriptor",
        canHandlePendingAuthorization: false
    };

    const headers = {
        'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
    };

    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.createCharge(payload, headers);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Checkout v2 - Get Charge API
```js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const chargeId = "S01-0000000-0000000-C000000";

    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.getCharge(chargeId);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 - Update Charge API
**Please note that is API is supported only for PSPs (Payment Service Provider)**

```js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        "statusDetails": {
            "state": "Canceled",
            "reasonCode": "ExpiredUnused"
        }
    };
    
    const chargeId = "S01-0000000-0000000-C000000";

    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.updateCharge(chargeId, payload);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Checkout v2 - Capture Charge API

``` js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        captureAmount: {
            amount: '10.00',
            currencyCode: 'USD'
        },
        softDescriptor: 'AMZN'
    };

    const headers = {
        'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
    };

    const chargeId = 'S01-0000000-0000000-C000000';
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.captureCharge(chargeId, payload, headers);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Checkout v2 - Cancel Charge API

``` js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        cancellationReason: 'REASON DESCRIPTION'
    };

    const chargeId = 'S01-0000000-0000000-C000000';
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.cancelCharge(chargeId, payload);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Checkout v2 - Create Refund API

``` js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        chargeId: 'S01-0000000-0000000-C000000',
        refundAmount: {
            amount: '14.00',
            currencyCode: 'USD'
        },
        softDescriptor: 'Descriptor'
    };

    const headers = {
        'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
    };

    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.createRefund(payload, headers);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Checkout v2 - Get Refund API

``` js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const refundId = "S01-0000000-0000000-R000000";

    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.getRefund(refundId);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## In Store MerchantScan

``` js
    const payload = {
        scanData: '[scanData]',
        scanReferenceId: '[scanReferenceId]',
        merchantCOE: 'US',
        ledgerCurrency: 'USD'
    };

    testInStoreClient.merchantScan(payload).then(function (response) {
        const merchantScanChargePermissionId = response.data.chargePermissionId;
    });
```

## Generate Button Signature
The signatures generated by this helper function are only valid for the Checkout v2 front-end buttons.  Unlike API signing, no timestamps are involved, so the result of this function can be considered a static signature that can safely be placed in your website JS source files and used repeatedly (as long as your payload does not change).

Example call to generateButtonSignature function:

``` js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const testPayClient = new Client.AmazonPayClient(config);
    const payload = {
        webCheckoutDetails: {
            checkoutReviewReturnUrl: 'https://localhost/test/checkoutReview.html',
            checkoutResultReturnUrl: 'https://localhost/test/checkoutResult.html'
        },
        storeId: 'amzn1.application-oa2-client.xxxxx'
    };
    const signature = testPayClient.generateButtonSignature(payload);
```

## Manual Signing (Advanced Use-Cases Only)
This SDK provides the ability to help you manually sign your API requests if you want to use your own code for sending the HTTPS request over the Internet.

Example call to apiCall function with values:

``` js
    /** API to process a request 
     *   - Makes an API Call using the specified options.
     * @param {Object} options - The options to make the API Call
     * @param {String} options.method - The HTTP request method
     * @param {String} options.urlFragment - The URI for the API Call
     * @param {String} [options.payload=null] - The payload for the API Call
     * @param {String} [options.headers=null] - The headers for the API Call
```

Example request method:
``` js
    const options = {
        method: 'POST',
        urlFragment: '${version}/in-store/merchantScan',
        payload: {
            scanData: 'UKhrmatMeKdlfY6b',
            scanReferenceId: '0b8fb271-2ae2-49a5-b35d4',
            merchantCOE: 'US',
            ledgerCurrency: 'USD',
            chargeTotal: {
                currencyCode: 'USD',
                amount: '2.00'
            },
            storeLocation: {
                countryCode: 'US'
            },
            metadata: {
                merchantNote: 'Merchant Name',
                customInformation: 'in-store Software Purchase',
                communicationContext: {
                    merchantStoreName: 'Store Name',
                    merchantOrderId: '789123'
                }
            }
        }
    };

    const client = new Client.InStoreClient(config);
    client.apiCall(options).then((apiResponse) => {
        const signedHeders = apiResponse;
    });
```

Example call to getSignedHeaders function with values:
(This will only be used if you don't use apiCall and want to create your own custom headers.)

``` js
    /** Signs the request headers
     *   - Signs the request provided and returns the signed headers object.
     * @param {Object} options - The options to make the API Call
     * @param {String} options.method - The HTTP request method
     * @param {String} options.urlFragment - The URI for the API Call
     * @param {String} [options.payload=null] - The payload for the API Call
     * @param {String} [options.headers=null] - The headers for the API Call
     **/
```

Example request method:
``` js
    const options = {
        method: 'POST',
        urlFragment: '${version}/in-store/merchantScan',
        payload: {
            scanData: 'UKhrmatMeKdlfY6b',
            scanReferenceId: '0b8fb271-2ae2-49a5-b35d4',
            merchantCOE: 'US',
            ledgerCurrency: 'USD',
            chargeTotal: {
                currencyCode: 'USD',
                amount: '2.00'
            },
            storeLocation: {
                countryCode: 'US'
            },
            metadata: {
                merchantNote: 'Merchant Name',
                customInformation: 'in-store Software Purchase',
                communicationContext: {
                    merchantStoreName: 'Store Name',
                    merchantOrderId: '789123'
                }
            }
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            'X-Amz-Pay-Region': 'us'
        }
    };

    const client = new Client.AmazonPayClient(config);
    const signedHeaders = client.getSignedHeaders(options);
```

# Reporting APIs code samples

## Amazon Checkout v2 Reporting APIs - GetReport API
```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: false,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const testPayClient = new Client.WebStoreClient(config);
    const requestPayload = {
        reportTypes: "_GET_FLAT_FILE_OFFAMAZONPAYMENTS_SETTLEMENT_DATA_",
    };
    const response = testPayClient.getReports(requestPayload);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 Reporting APIs - GetReportById API
```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: false,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const reportId = '1234567890';
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.getReportById(reportId);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 Reporting APIs - GetReportDocument API
```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: false,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const reportDocumentId = 'amzn1.tortuga.0.000000000-0000-0000-0000-000000000000.00000000000000';
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.getReportDocument(reportDocumentId);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 Reporting APIs - GetReportSchedules API
```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: false,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const reportTypes = '_GET_FLAT_FILE_OFFAMAZONPAYMENTS_ORDER_REFERENCE_DATA_,_GET_FLAT_FILE_OFFAMAZONPAYMENTS_BILLING_AGREEMENT_DATA_';
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.getReportSchedules(reportTypes);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 Reporting APIs - GetReportScheduleById API
```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: false,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const reportScheduleId = '1234567890';
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.getReportScheduleById(reportScheduleId);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 Reporting APIs - CreateReport API
```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: false,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const requestPayload = {
        reportType: '_GET_FLAT_FILE_OFFAMAZONPAYMENTS_AUTHORIZATION_DATA_',
        startTime: '20221114T074550Z',
        endTime: '20221114T074550Z'
    }
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.createReport(requestPayload);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 Reporting APIs - CreateReportSchedule API
```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: false,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const requestPayload = {
        reportType: "_GET_FLAT_FILE_OFFAMAZONPAYMENTS_ORDER_REFERENCE_DATA_",
        scheduleFrequency: "P1D",
        nextReportCreationTime: "20230317T074550Z",
        deleteExistingSchedule: false
    }
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.createReportSchedule(requestPayload);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 Reporting APIs - CancelReportSchedule API
```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: false,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const reportScheduleId = "1234567890";
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.cancelReportSchedule(reportScheduleId);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 SPC - Finalize Checkout Session API
```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const checkoutSessionId = "00000000-0000-0000-0000-000000000000";
    const payload = {
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
            phoneNumber: "800-000-0000"
        },
        billingAddress: null,
        chargeAmount: {
            amount: 10,
            currencyCode: "USD"
        },
        totalOrderAmount: {
            amount: 10,
            currencyCode: "USD"
        },
        paymentIntent: "Confirm",
        canHandlePendingAuthorization: false
    };
    const headers = {
        'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
    };

    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.finalizeCheckoutSession(checkoutSessionId, payload, headers);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 Dispute APIs - Create Dispute API

```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        'chargeId': 'S01-0000000-0000000-C000000',
        'providerMetadata': {
            'providerDisputeId': 'XXXXXXXXXXXX'
        },
        'disputeAmount': {
            'amount': '1',
            'currencyCode': 'JPY'
        },
        'filingReason': 'ProductNotReceived',
        'filingTimestamp': Date.now(),
        'statusDetails': {
            'state': 'ActionRequired'
        },
        'merchantResponseDeadline': Date.now()+ (14 * 24 * 60 * 60 * 1000)
    };

    const headers = {
        'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
    };
    
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.createDispute(payload, headers);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 Dispute APIs - Get Dispute API

```js
const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };
    
    const disputeId = 'S01-0000000-0000000-B000000'
    
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.getDispute(disputeId);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 Dispute APIs - Update Dispute API

```js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        "statusDetails": {
            "resolution": "MerchantWon",
            "state": "Resolved",
            "reasonCode": "MerchantAcceptedDispute",
            "reasonDescription": "Merchant accepted the dispute request"
        },
        "closureTimestamp": Date.now()
    };

    const disputeId = 'S01-0000000-0000000-B000000'
    
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.updateDispute(disputeId,payload);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 Dispute APIs - Contest Dispute API

```js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        "merchantEvidences":  [
            {
                "evidenceType" : "TrackingNumber",
                "fileId": "20ca8c0f-3778-1b5a-8598-3d38cfdc4bde",
                "evidenceText": "raw text supporting merchant evidence"
            }
        ]
    };

    const disputeId = 'S01-0000000-0000000-B000000'
    
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.contestDispute(disputeId,payload);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

## Amazon Checkout v2 File APIs - File API

```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        "type" : "jpg",
        "purpose" : "disputeEvidence"
    };

    const headers = {
        'x-amz-pay-idempotency-key': uuidv4().toString().replace(/-/g, '')
    };
    
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.uploadFile(payload,headers);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

### Amazon Checkout v2 Merchant Onboarding & Account Management APIs for Authorised Solution Providers - Create Merchant Account API

```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        uniqueReferenceId: "Unique_Reference_Id",
        ledgerCurrency: "JPY",
        businessInfo: {
            email: "abhi@abc.com",
            businessType: "CORPORATE",
            businessLegalName: "密林コーヒー",
            businessCategory: "Beauty",
            businessDisplayName: "Abhi's Cafe",
            annualSalesVolume: {
                amount: "100000",
                currencyCode: "JPY"
            },
            countryOfEstablishment: "JP",
            businessAddress: {
                addressLine1: "扇町４丁目５－１",
                addressLine2: "フルフィルメントセンタービル",
                city: "小田原市",
                stateOrRegion: "神奈川県",
                postalCode: "250-0001",
                countryCode: "JP",
                phoneNumber: {
                    countryCode: "81",
                    number: "2062062061"
                }
            },
            customerSupportInformation: {
                customerSupportEmail: "test.merchant_abhi@abc.com",
                customerSupportPhoneNumber: {
                    countryCode: "1",
                    number: "1234567",
                    extension: "123"
                }
            }
        },
        beneficiaryOwners: [
            {
                personFullName: "Abhishek Kumar",
                residentialAddress: {
                    addressLine1: "扇町４丁目５－１",
                    addressLine2: "フルフィルメントセンタービル",
                    city: "小田原市",
                    stateOrRegion: "神奈川県",
                    postalCode: "250-0001",
                    countryCode: "JP",
                    phoneNumber: {
                        countryCode: "81",
                        number: "2062062061"
                    }
                }
            }
        ],
        primaryContactPerson: {
            personFullName: "Abhishek Kumar"
        },
        integrationInfo: {
            ipnEndpointUrls: [
                "https://yourdomainname.com/ipnendpoint1",
                "https://yourdomainname.com/ipnendpoint2"
            ]
        },
        stores: [
            {
                domainUrls: [
                    "https://yourdomainname.com"
                ],
                storeName: "Rufus's Cafe",
                privacyPolicyUrl: "https://yourdomainname.com/privacy",
                storeStatus: {
                    state: "ACTIVE",
                    reasonCode: null
                }
            }
        ],
        merchantStatus: {
            statusProvider: "Ayden",
            state: "ACTIVE",
            reasonCode: null
        }
    };
    
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.createMerchantAccount(payload);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```
### Amazon Checkout v2 Merchant Onboarding & Account Management APIs for Authorised Solution Providers - Update Merchant Account API

```js
    const fs = require('fs');
    const uuidv4 = require('uuid/v4');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        businessInfo: {
            email: "abhi_updated@abc.com",
            businessType: "CORPORATE",
            businessLegalName: "密林コーヒー",
            businessCategory: "Beauty",
            businessDisplayName: "Abhi's Golden Cafe",
            annualSalesVolume: {
                amount: "500000",
                currencyCode: "JPY"
            },
            countryOfEstablishment: "JP",
            businessAddress: {
                addressLine1: "扇町４丁目５－１",
                addressLine2: "フルフィルメントセンタービル",
                city: "小田原市",
                stateOrRegion: "神奈川県",
                postalCode: "250-0025",
                countryCode: "JP",
                phoneNumber: {
                    countryCode: "81",
                    number: "2062062065"
                }
            },
            customerSupportInformation: {
                customerSupportEmail: "test.merchant_abhi@abc.com",
                customerSupportPhoneNumber: {
                    countryCode: "1",
                    number: "9999999",
                    extension: "123"
                }
            }
        }
    };
    
    const headers = {
        'x-amz-pay-authtoken': 'AUTH-TOKEN'
    };
    
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.updateMerchantAccount("AXXXXXXX",payload,headers);
    
    response.then(function (result) {
        console.log(result.data);
    }).catch(err => {
        console.log(err);
    });
```

### Amazon Checkout v2 Merchant Onboarding & Account Management APIs for Authorised Solution Providers - Merchant Account Claim API

```js
    const fs = require('fs');
    const Client = require('@amazonpay/amazon-pay-api-sdk-nodejs');

    const config = {
        publicKeyId: 'YOUR_PUBLIC_KEY_ID',
        privateKey: fs.readFileSync('tst/private.pem'),
        region: 'YOUR_REGION_CODE',
        sandbox: true,
        algorithm: 'AMZN-PAY-RSASSA-PSS-V2' // Amazon Signing Algorithm, Optional: uses AMZN-PAY-RSASSA-PSS if not specified
    };

    const payload = {
        uniqueReferenceId: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxx'
    };
    
    
    const testPayClient = new Client.WebStoreClient(config);
    const response = testPayClient.merchantAccountClaim("AXXXXXXX",payload);
    
    response.then(function (result) {
        console.log(result.data);
        console.log('Location:', result.headers["location"]);
    }).catch(err => {
        console.log(err);
    });
```
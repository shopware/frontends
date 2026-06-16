# Amazon Pay SDK - V2 - Node JS - Test
  
# API's Included to Test
#### WebStoreClient
  - CreateCheckoutSession
  - GetCheckoutSession
  - UpdateCheckoutSession
  - GetChargePermission
  - UpdateChargePermission
  - CloseChargePermission
  - CreateCharge
  - GetCharge
  - CaptureCharge
  - CreateRefund
  - GetRefund

#### InStoreClient
  - MerchantScan
  - Charge
  - Refund
  
### Installation
Requires node should be installed in machine.
Install the dependencies
```sh
$ npm install
```

### Plugins Used
SDK  is currently extended with the following plugins. 

| Plugin | README |
| ------ | ------ |
| Mocha | https://mochajs.org/ |
| Chai | https://www.chaijs.com/ |

### Testing
- Provide the Public Key ID, Region & Sandbox (true or false) in config.js
- Replace AmazonPay_publicKeyId.pem with the path to your private key file
- Get ChargePermission ID from Test Integration and provide it in webStoreClientTest.js file
- Open your favorite Terminal and run these commands.

Command :
```sh
$ npm test
```
### Sample Output
```sh

 InStore Client Test Cases
    ✓ Validating Merchant Scan API (1175ms)
    ✓ Validating Charge API (1443ms)
    ✓ Validating Refund API (871ms)

  WebStore Client Test Cases - Checkout Session APIs
    ✓ Validating Create Checkout Session API (1027ms)
    ✓ Validating Get Checkout Session API (517ms)
    ✓ Validating Update Checkout Session API (528ms)

  WebStore Client Test Cases - Charge Permission APIs
    ✓ Validating Get Charge Permission API (1395ms)
    ✓ Validating Update Charge Permission API (1022ms)

  WebStore Client Test Cases - Charge APIs
    ✓ Validating Create Charge API (1361ms)
    ✓ Validating Get Charge API (734ms)
    ✓ Validating Capture Charge API (1080ms)

  WebStore Client Test Cases - Refund APIs
    ✓ Validating Create Refund API (1020ms)
    ✓ Validating Get Refund API (718ms)

  13 passing (11s)
```
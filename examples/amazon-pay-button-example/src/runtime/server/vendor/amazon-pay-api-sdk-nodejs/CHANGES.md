### Version 2.3.4 - July 2025
* Introducing new Account Management APIs that allow partners to programmatically onboard merchants onto the Amazon Pay.
* The `createMerchantAccount` - Provide merchant info through this API to create loginable account for your merchant partners. Client should expect either a success message or a detailed error message based on data validation and fulfillment.
* The `updateMerchantAccount` - Updates a merchant account and store for the given Amazon merchantAccountId. Partners are only able to update fields which do not change the legal business entity itself.
* The `merchantAccountClaim` - Initiates the merchant account claim process. Clients should expect a redirection response or a detailed error message based on data validation and fulfillment.

### Version 2.3.3 - May 2025
* Introducing GetDispute API which is used to retrieve details of a chargeback dispute associated with a specific order
* Introducing retry logic for HTTP Code 425

### Version 2.3.2 - February 2025
* Introducing new v2 Dispute APIs for PSPs (Payment Service Provider). Buyers can create a dispute by filing an Amazon Pay A-to-z Guarantee claim or by filing a chargeback with their bank.
* The `createDispute` API is used to notify Amazon of a newly created chargeback dispute by a buyer on a transaction processed by the PSP (Payment Service Provider), ensuring the dispute is properly accounted for in the Amazon Pay systems.
* The `updateDispute` API is used to notify Amazon of the closure status of a chargeback dispute initiated by a buyer for orders processed by a partner PSP (Payment Service Provider), ensuring proper accounting within the Amazon systems.
* The `contestDispute` API is used by the partner, on behalf of the merchant, to formally contest a dispute managed by Amazon, requiring the submission of necessary evidence files within the specified Dispute Window (11 days for Chargeback, 7 days for A-Z Claims).
* The `uploadFile` API is utilised by PSPs (Payment Service Provider) to upload file-based evidence when a merchant contests a dispute, providing the necessary reference ID to the evidence file as part of the Update Dispute API process.
* Introducing the `updateCharge` API which enables you to update the charge status of any PSP (Payment Service Provider) processed payment method (PPM) transactions.

### Version 2.3.1 - October 2023
* Introducing new API called finalizeCheckoutSession which validates checkout attributes and finalizes checkout session. On success returns charge permission id and charge id. Use this API to process payments for JavaScript-based integrations.
* Introducing new Merchant Onboarding & Account Management APIs, which allows our partners to onboard merchants programatically and as part of account management offer them creation, updation and deletion/dissociation capability.
* Fixed the getReports API to handle null query parameters without throwing errors.
* Added the Sample Code snippets for the Charge APIs, Charge Permission APIs and Refund APIs.
* Updated the README file.

### Version 2.3.0 - March 2023
* Introducing new v2 Reporting APIs. Reports allow you to retieve consolidated data about Amazon Pay transactions and settlements. In addition to managing and downloading reports using Seller Central, Amazon Pay offers APIs to manage and retrieve your reports.
* Introducing new signature generation algorithm AMZN-PAY-RSASSA-PSS-V2 and increasing salt length from 20 to 32.
* Added support for handling new parameter 'shippingAddressList' in Checkout Session response. Change is fully backwards compatible.
* Added Error code 408 to API retry logic
* Note : To use new algorithm AMZN-PAY-RSASSA-PSS-V2, "algorithm" needs to be provided as an additional field in "config" and also while rendering Amazon Pay button in "createCheckoutSessionConfig". The changes are backwards-compatible, SDK will use AMZN-PAY-RSASSA-PSS by default.
 
#### Version 2.2.2 - June 2022
* Fixed security vulnerabilities in dependencies.

#### Version 2.2.1 - January 2022
* Applied patch to address issues occurred in Version 2.2.0.
**Please dont use Version 2.2.0**

#### Version 2.2.0 - January 2022
* Migrated signature generating algorithm from AMZN-PAY-RSASSA-PSS to AMZN-PAY-RSASSA-PSS-V2 & increased salt length from 20 to 32
* Note : From this SDK version, "algorithm" need to be provided as additional field in "createCheckoutSessionConfig" while rendering Amazon Pay button.

#### Version 2.1.5 - October 2021
* Fixed Security Vulnerabilities by upgrading 'axios' library version
* ReadMe file updates

#### Version 2.1.4 - May 2021
* Enabled support for environment specific keys (i.e Public key & Private key). The changes are fully backwards-compatible, where merchants can also use non environment specific keys

#### Version 2.1.3 - April 2021
* Removed deprecated library 'request' which is used to make HTTP/HTTPS calls
* Added library 'axios' to make HTTP/HTTPS calls

#### Version 2.1.2 - March 2021
* Removing deprecated API calls

#### Version 2.1.1 - June 2020
* Underlying endpoint for getBuyer API changed

#### Version 2.1.0 - June 2020
* Added getBuyer() API call

#### Version 2.0.1 - May 2020
* Modify package.json to use @amazonpay scope for npm

#### Version 2.0.0 - April 2020
* Initial release

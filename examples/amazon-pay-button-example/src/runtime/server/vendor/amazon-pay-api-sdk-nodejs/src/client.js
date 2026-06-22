"use strict";

const helper = require("./clientHelper");
const constants = require("./constants");

class AmazonPayClient {
  constructor(configArgs) {
    this.configArgs = Object.freeze(configArgs);
  }

  /** API to process a request
   *   - Makes an API Call using the specified options.
   * @param {Object} options - The options to make the API Call
   * @param {Number} maxRedirects - Number of max redirects allowed
   * @param {String} options.method - The HTTP request method
   * @param {String} options.urlFragment - The URI for the API Call
   * @param {String} [options.payload=null] - The payload for the API Call
   * @param {Object} [options.headers=null] - The headers for the API Call
   * @param {Object} [options.queryParams=null] - The headers for the API Call
   **/
  apiCall(options, maxRedirects = constants.DEFAULT_REDIRECT) {
    const preparedOptions = helper.prepareOptions(this.configArgs, options);
    preparedOptions.headers = helper.signHeaders(
      this.configArgs,
      preparedOptions,
    );
    return helper.invokeApi(this.configArgs, preparedOptions, maxRedirects);
  }

  /** Signs the request headers
   *   - Signs the request provided and returns the signed headers object.
   * @param {Object} options - The options to make the API Call
   * @param {String} options.method - The HTTP request method
   * @param {String} options.urlFragment - The URI for the API Call
   * @param {String} [options.payload=null] - The payload for the API Call
   * @param {Object} [options.headers=null] - The headers for the API Call
   **/
  getSignedHeaders(options) {
    const preparedOptions = helper.prepareOptions(this.configArgs, options);
    return helper.signHeaders(this.configArgs, preparedOptions);
  }

  /** Lets the solution provider get Authorization Token for their merchants if they are granted the delegation.
   *   - Please note that your solution provider account must have a pre-existing relationship (valid and active MWS authorization token) with the merchant account in order to use this function.
   * @param {String} mwsAuthToken - The mwsAuthToken
   * @param {String} merchantId - The MerchantId
   * @param {Object} [headers=null] - The headers for the request
   **/
  getAuthorizationToken(mwsAuthToken, merchantId, headers = null) {
    return this.apiCall({
      method: "GET",
      urlFragment: `authorizationTokens/${mwsAuthToken}`,
      headers: headers,
      queryParams: {
        merchantId: merchantId,
      },
    });
  }

  /** Generates static signature for amazon.Pay.renderButton used by checkout.js.
   *   - Returns signature as string.
   * @param {Object} payload - The payload for the request
   * @returns {String} signature
   **/
  generateButtonSignature(payload) {
    return helper.signPayload(this.configArgs, payload);
  }

  /** Lets the solution provider make the DeliveryTrackers request with their auth token.
   *   - Lets you provide shipment tracking information to Amazon Pay so that Amazon Pay will be able to notify buyers on Alexa when shipments are delivered.
   * @see https://developer.amazon.com/docs/amazon-pay-onetime/delivery-notifications.html#api-reference
   * @param {Object} payload - The payload for the request
   * @param {String} payload.amazonOrderReferenceId - The Amazon Order Reference ID or Charge Permission Id associated with the order for which the shipments need to be tracked
   * @param {String} payload.trackingNumber - The tracking number for the shipment provided by the shipping company
   * @param {Object} payload.carrierCode - The shipping company code used for delivering goods to the customer
   * @param {Object} [headers=null] - The headers for the request
   **/
  deliveryTrackers(payload, headers = null) {
    return this.apiCall({
      method: "POST",
      urlFragment: "deliveryTrackers",
      payload: payload,
      headers: headers,
    });
  }
}

class InStoreClient extends AmazonPayClient {
  constructor(configArgs) {
    super(configArgs);
  }

  /** API to initiate a purchase with a merchant
   *   - Initiates a purchase with a merchant.
   * @see //TODO Update Live URL
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   **/
  merchantScan(payload, headers = null) {
    return this.apiCall({
      method: "POST",
      urlFragment: "in-store/merchantScan",
      payload: payload,
      headers: headers,
    });
  }

  /** API to create Charge to the buyer
   *   - Creates a charge to the buyer with the requested amount.
   * @see //TODO Update Live URL
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   **/
  charge(payload, headers = null) {
    return this.apiCall({
      method: "POST",
      urlFragment: "in-store/charge",
      payload: payload,
      headers: headers,
    });
  }

  /** API to create a Refund to the buyer
   *   - Refunds an amount that was previously charged to the buyer.
   * @see //TODO Update Live URL
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   **/
  refund(payload, headers = null) {
    return this.apiCall({
      method: "POST",
      urlFragment: "in-store/refund",
      payload: payload,
      headers: headers,
    });
  }
}

class WebStoreClient extends AmazonPayClient {
  constructor(configArgs) {
    super(configArgs);
  }

  /** API to get the Buyer object
   *   - Get Buyer details can include buyer ID, name, email address, postal code, and country code
   *   - when used with the Amazon.Pay.renderButton 'SignIn' productType and corresponding signInScopes
   * @param {String} buyerToken - The checkout session Id
   * @param {Object} [headers=null] - The headers for the request
   **/
  getBuyer(buyerToken, headers = null) {
    return this.apiCall({
      method: "GET",
      urlFragment: `buyers/${buyerToken}`,
      headers: headers,
    });
  }

  /** API to create a CheckoutSession object
   *   - Creates a new CheckoutSession object.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/checkout-session.html#create-checkout-session
   * @param {Object} payload - The payload for the request
   * @param {Object} headers - The headers for the request
   **/
  createCheckoutSession(payload, headers) {
    return this.apiCall({
      method: "POST",
      urlFragment: "checkoutSessions",
      payload: payload,
      headers: headers,
    });
  }

  /** API to get the CheckoutSession object
   *   - Retrives details of a previously created CheckoutSession object.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/checkout-session.html#get-checkout-session
   * @param {String} checkoutSessionId - The checkout session Id
   * @param {Object} [headers=null] - The headers for the request
   **/
  async getCheckoutSession(checkoutSessionId, headers = null) {
    const response = await this.apiCall({
      method: "GET",
      urlFragment: `checkoutSessions/${checkoutSessionId}`,
      headers: headers,
    });

    return helper.enhanceResponseWithShippingAddressList(response);
  }

  /** API to update the CheckoutSession object
   *   - Updates a previously created CheckoutSession object.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/checkout-session.html#update-checkout-session
   * @param {String} checkoutSessionId - The checkout session Id
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   **/
  async updateCheckoutSession(checkoutSessionId, payload, headers = null) {
    const response = await this.apiCall({
      method: "PATCH",
      urlFragment: `checkoutSessions/${checkoutSessionId}`,
      payload: payload,
      headers: headers,
    });

    return helper.enhanceResponseWithShippingAddressList(response);
  }

  /** API to complete a Checkout Session
   *   - Confirms the completion of buyer checkout.
   * @see //TODO Update Live URL
   * @param {String} checkoutSessionId - The checkout session Id
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   **/
  async completeCheckoutSession(checkoutSessionId, payload, headers = null) {
    const response = await this.apiCall({
      method: "POST",
      urlFragment: `checkoutSessions/${checkoutSessionId}/complete`,
      payload: payload,
      headers: headers,
    });

    return helper.enhanceResponseWithShippingAddressList(response);
  }

  // ----------------------------------- Buy Now -----------------------------------

  /** FinalizeCheckoutSession API which enables Pay to validate payment critical attributes and also update book-keeping attributes present in merchantMetadata
   *
   * @param {String} checkoutSessionId - The checkout session Id
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   */
  finalizeCheckoutSession(checkoutSessionId, payload, headers = null) {
    return this.apiCall({
      method: "POST",
      urlFragment: `checkoutSessions/${checkoutSessionId}/finalize`,
      payload: payload,
      headers: headers,
    });
  }

  /** API to get a ChargePermission object
   *   - Retrives details of a previously created ChargePermission object.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/charge-permission.html#get-charge-permission
   * @param {String} chargePermissionId - The charge permission Id
   * @param {Object} [headers=null] - The headers for the request
   **/
  getChargePermission(chargePermissionId, headers = null) {
    return this.apiCall({
      method: "GET",
      urlFragment: `chargePermissions/${chargePermissionId}`,
      headers: headers,
    });
  }

  /** API to update a ChargePermission object
   *   - Updates a previously created ChargePermission object.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/charge-permission.html#update-charge-permission
   * @param {String} chargePermissionId - The charge permission Id
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   **/
  updateChargePermission(chargePermissionId, payload, headers = null) {
    return this.apiCall({
      method: "PATCH",
      urlFragment: `chargePermissions/${chargePermissionId}`,
      payload: payload,
      headers: headers,
    });
  }

  /** API to close a ChargePermission object
   *   - Closes a perviously created ChargePermission object.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/charge-permission.html#close-charge-permission
   * @param {String} chargePermissionId - The charge permission Id
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   **/
  closeChargePermission(chargePermissionId, payload, headers = null) {
    return this.apiCall({
      method: "DELETE",
      urlFragment: `chargePermissions/${chargePermissionId}/close`,
      payload: payload,
      headers: headers,
    });
  }

  /** API to create a Charge object
   *   - Creates a new Charge object.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/charge.html#create-charge
   * @param {Object} payload - The payload for the request
   * @param {Object} headers - The headers for the request
   **/
  createCharge(payload, headers) {
    return this.apiCall({
      method: "POST",
      urlFragment: "charges",
      payload: payload,
      headers: headers,
    });
  }

  /** API to get the Charge object
   *   - Retrieves a perviously created Charge object.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/charge.html#get-charge
   * @param {String} chargeId - The charge Id
   * @param {Object} [headers=null] - The headers for the request
   **/
  getCharge(chargeId, headers = null) {
    return this.apiCall({
      method: "GET",
      urlFragment: `charges/${chargeId}`,
      headers: headers,
    });
  }

  /** Amazon Checkout v2 - Update Charge
   *
   * The updateCharge operation is used to update the charge status of any PSP (Payment Service Provider) processed payment method (PPM) transactions.
   * Please note that is API is supported only for PSPs (Payment Service Provider)
   *
   * @param {String} chargeId - The charge Id
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   *
   */
  updateCharge(chargeId, payload, headers) {
    return this.apiCall({
      method: "PATCH",
      urlFragment: `charges/${chargeId}`,
      payload: payload,
      headers: headers,
    });
  }

  /** API to create a captureCharge request
   *   - Captures an existing charge
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/charge.html#capture-charge
   * @param {String} chargeId - The charge Id
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   **/
  captureCharge(chargeId, payload, headers = null) {
    return this.apiCall({
      method: "POST",
      urlFragment: `charges/${chargeId}/capture`,
      payload: payload,
      headers: headers,
    });
  }

  /** API to create a cancelCharge request
   *   - Cancels an existing charge.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/charge.html#cancel-charge
   * @param {String} chargeId - The charge Id
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   **/
  cancelCharge(chargeId, payload, headers = null) {
    return this.apiCall({
      method: "DELETE",
      urlFragment: `charges/${chargeId}/cancel`,
      payload: payload,
      headers: headers,
    });
  }

  /** API to create a Refund object
   *   - Generates a refund.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/refund.html#create-refund
   * @param {Object} payload - The payload for the request
   * @param {Object} headers - The headers for the request
   **/
  createRefund(payload, headers) {
    return this.apiCall({
      method: "POST",
      urlFragment: "refunds",
      payload: payload,
      headers: headers,
    });
  }

  /** API to get a Refund object
   *   - Retreives details of an existing refund.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/refund.html#get-refund
   * @param {String} refundId - The refund Id
   * @param {Object} [headers=null] - The headers for the request
   **/
  getRefund(refundId, headers = null) {
    return this.apiCall({
      method: "GET",
      urlFragment: `refunds/${refundId}`,
      headers: headers,
    });
  }

  // ----------------------------------- CV2 REPORTING APIS -----------------------------------

  /** API to get Reports
   *   - retrieves details for the reports that match the filters that you specify.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/reports.html#get-reports
   * @param {Object} [queryParameters=null] - The queryParameters for the request
   * @param {Object} [headers=null] - The headers for the request
   **/
  getReports(queryParameters = null, headers = null) {
    if (queryParameters) {
      const { reportTypes, processingStatuses } = queryParameters;
      if (Array.isArray(reportTypes)) {
        queryParameters.reportTypes = reportTypes.toString();
      }
      if (Array.isArray(processingStatuses)) {
        queryParameters.processingStatuses = processingStatuses.toString();
      }
    }
    return this.apiCall({
      method: "GET",
      urlFragment: `reports`,
      headers: headers,
      queryParams: queryParameters,
    });
  }

  /** API to get Report by Id
   *   - retrieves report details for the given reportId.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/reports.html#get-report-by-id
   * @param {String} reportId - The Report Id
   * @param {Object} [headers=null] - The headers for the request
   **/
  getReportById(reportId, headers = null) {
    return this.apiCall({
      method: "GET",
      urlFragment: `reports/${reportId}`,
      headers: headers,
    });
  }

  /** API to get Report Document
   *   - returns the pre-signed S3 URL for the report. The report can be downloaded using this URL.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/reports.html#get-report-document
   * @param {String} reportDocumentId - The Report Id
   * @param {Object} [headers=null] - The headers for the request
   **/
  getReportDocument(reportDocumentId, headers = null) {
    return this.apiCall({
      method: "GET",
      urlFragment: `report-documents/${reportDocumentId}`,
      headers: headers,
    });
  }

  /** API to get Report Schedules
   *   - returns report schedule details that match the filters criteria specified.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/reports.html#get-report-schedules
   * @param {String} [reportTypes=null] - The Report Id
   * @param {Object} [headers=null] - The headers for the request
   **/
  getReportSchedules(reportTypes = null, headers = null) {
    const queryParameters = {
      reportTypes: Array.isArray(reportTypes)
        ? reportTypes.toString()
        : reportTypes,
    };
    return this.apiCall({
      method: "GET",
      urlFragment: `report-schedules`,
      headers: headers,
      queryParams: reportTypes ? queryParameters : reportTypes,
    });
  }

  /** API to get Report Schedule by Id
   *   - returns the report schedule details that match the given ID.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/reports.html#get-report-schedule-by-id
   * @param {String} reportScheduleId - The Report Schedule Id
   * @param {Object} [headers=null] - The headers for the request
   **/
  getReportScheduleById(reportScheduleId, headers = null) {
    return this.apiCall({
      method: "GET",
      urlFragment: `report-schedules/${reportScheduleId}`,
      headers: headers,
    });
  }

  /** API to create Report
   *   - submits a request to generate a report based on the reportType and date range specified.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/reports.html#create-report
   * @param {Object} requestPayload - The payload for the request
   * @param {Object} headers - The headers for the request
   **/
  createReport(requestPayload, headers) {
    return this.apiCall({
      method: "POST",
      urlFragment: `reports`,
      payload: requestPayload,
      headers: headers,
    });
  }

  /** API to create Report Schedule
   *   - creates a report schedule for the given reportType. Only one schedule per report type allowed.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/reports.html#create-report-schedules
   * @param {Object} requestPayload - The payload for the request
   * @param {Object} headers - The headers for the request
   **/
  createReportSchedule(requestPayload, headers) {
    return this.apiCall({
      method: "POST",
      urlFragment: `report-schedules`,
      payload: requestPayload,
      headers: headers,
    });
  }

  /** API to cancel Report Schedule
   *   - cancels the report schedule with the given reportScheduleId.
   * @see https://developer.amazon.com/docs/amazon-pay-api-v2/reports.html#cancel-report-schedule
   * @param {String} reportScheduleId - The Report Schedule Id
   * @param {Object} [headers=null] - The headers for the request
   **/
  cancelReportSchedule(reportScheduleId, headers = null) {
    return this.apiCall({
      method: "DELETE",
      urlFragment: `report-schedules/${reportScheduleId}`,
      headers: headers,
    });
  }

  // ----------------------------------- Merchant Onboarding & Account Management APIs for Authorised Merchants --------------------

  /**
   * Creates a non-logginable account for your merchant partners. These would be special accounts through which Merchants would not be able to login to Amazon or access Seller Central.
   *
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   */
  registerAmazonPayAccount(payload, headers = null) {
    return this.apiCall({
      method: "POST",
      urlFragment: `${constants.ACCOUNT_MANAGEMENT}`,
      payload: payload,
      headers: headers,
    });
  }

  /**
   * Updates a merchant account for the given Merchant Account ID. We would be allowing our partners to update only a certain set of fields which won’t change the legal business entity itself.
   *
   * @param {String} merchantAccountId - Internal Merchant Account ID
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   */
  updateAmazonPayAccount(merchantAccountId, payload, headers = null) {
    return this.apiCall({
      method: "PATCH",
      urlFragment: `${constants.ACCOUNT_MANAGEMENT}/${merchantAccountId}`,
      payload: payload,
      headers: headers,
    });
  }

  /**
   * Deletes the Merchant account for the given Merchant Account ID. Partners can close the merchant accounts created for their merchant partners.
   *
   * @param {String} merchantAccountId - Internal Merchant Account ID
   * @param {Object} [headers=null] - The headers for the requestrs
   */
  deleteAmazonPayAccount(merchantAccountId, headers = null) {
    return this.apiCall({
      method: "DELETE",
      urlFragment: `${constants.ACCOUNT_MANAGEMENT}/${merchantAccountId}`,
      headers: headers,
    });
  }

  // ----------------------------------- Merchant Onboarding & Account Management APIs for Authorised Solution Providers -----------------------------------

  /**
   * Provide merchant info through this API to create loginable account for your merchant partners. Partners (Solution Providers) should expect either a success message or a detailed error message based on data validation and fulfillment..
   *
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - Optional custom headers for the request
   */
  createMerchantAccount(payload, headers = null) {
    return this.apiCall({
      method: "POST",
      urlFragment: `${constants.ACCOUNT_MANAGEMENT}`,
      payload: payload,
      headers: headers,
    });
  }

  /**
   * Updates a merchant account and store for the given Amazon merchantAccountId. Partners(Solution Providers) are only able to update fields which do not change the legal business entity itself and till the account is claimed.
   *
   * @param {String} merchantAccountId - Internal Merchant Account ID
   * @param {Object} payload - The payload for the request
   * @param {Object} headers - The headers for the request
   */
  updateMerchantAccount(merchantAccountId, payload, headers) {
    return this.apiCall({
      method: "PATCH",
      urlFragment: `${constants.ACCOUNT_MANAGEMENT}/${merchantAccountId}`,
      payload: payload,
      headers: headers,
    });
  }

  /**
   * Claims an existing merchant account using the provided Merchant Account ID.
   *
   * @param {String} merchantAccountId - Internal Merchant Account ID
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - Optional custom headers for the request
   */
  merchantAccountClaim(merchantAccountId, payload, headers = null) {
    return this.apiCall(
      {
        method: "POST",
        urlFragment: `${constants.ACCOUNT_MANAGEMENT}/${merchantAccountId}/claim`,
        payload: payload,
        headers: headers,
      },
      0,
    );
  }

  // ----------------------------------- Dispute APIs -----------------------------------

  /** Amazon Checkout v2 - Create Dispute
   *
   * The createDispute operation is used to notify Amazon of a newly created chargeback dispute by a buyer on a transaction
   * processed by the PSP (Payment Service Provider), ensuring the dispute is properly accounted for in the Amazon Pay systems.
   *
   * @param {Object} payload - The payload for the request
   * @param {Object} headers - The headers for the request
   *
   */
  createDispute(payload, headers) {
    return this.apiCall({
      method: "POST",
      urlFragment: `${constants.DISPUTES}`,
      payload: payload,
      headers: headers,
    });
  }

  /** Amazon Checkout v2 - Get Dispute
   *
   * The getDispute operation is used to retrieve details of a chargeback dispute associated with a specific order
   *
   * @param {String} disputeId - The dispute ID
   * @param {Object} [headers=null] - The headers for the request
   */
  getDispute(disputeId, headers = null) {
    return this.apiCall({
      method: "GET",
      urlFragment: `${constants.DISPUTES}/${disputeId}`,
      headers: headers,
    });
  }

  /** Amazon Checkout v2 - Update Dispute
   *
   * The updateDispute operation is used to notify Amazon of the closure status of a chargeback dispute initiated by a
   * buyer for orders processed by a partner PSP (Payment Service Provider), ensuring proper accounting within the Amazon systems.
   *
   * @param {String} disputeId - The dispute ID
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   *
   */
  updateDispute(disputeId, payload, headers) {
    return this.apiCall({
      method: "PATCH",
      urlFragment: `${constants.DISPUTES}/${disputeId}`,
      payload: payload,
      headers: headers,
    });
  }

  /** Amazon Checkout v2 - Contest Dispute
   *
   * The contestDispute operation is used by the partner, on behalf of the merchant, to formally contest a dispute
   * managed by Amazon, requiring the submission of necessary evidence files within the specified
   * Dispute Window (11 days for Chargeback, 7 days for A-Z Claims).
   *
   * @param {String} disputeId - The dispute ID
   * @param {Object} payload - The payload for the request
   * @param {Object} [headers=null] - The headers for the request
   *
   */
  contestDispute(disputeId, payload, headers) {
    return this.apiCall({
      method: "POST",
      urlFragment: `${constants.DISPUTES}/${disputeId}/${constants.CONTEXT}`,
      payload: payload,
      headers: headers,
    });
  }

  // ----------------------------------- File APIs -----------------------------------

  /** Amazon Checkout v2 - Upload File
   *
   * The uploadFile operation is utilised by PSPs (Payment Service Provider) to upload file-based evidence when a
   * merchant contests a dispute, providing the necessary reference ID to the evidence file as part of
   * the Update Dispute API process.
   *
   * @param {Object} payload - The payload for the request
   * @param {Object} headers - The headers for the request
   *
   */
  uploadFile(payload, headers) {
    return this.apiCall({
      method: "POST",
      urlFragment: `${constants.FILES}`,
      payload: payload,
      headers: headers,
    });
  }
}

module.exports = {
  AmazonPayClient: AmazonPayClient,
  InStoreClient: InStoreClient,
  WebStoreClient: WebStoreClient,
};

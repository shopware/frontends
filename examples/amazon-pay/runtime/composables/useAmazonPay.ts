export function useAmazonPay() {
  const renderJsButton = (elementId: string) => {
    window?.amazon?.Pay.renderButton(elementId, {
      // set checkout environment
      merchantId: "A2XEHS1UKQ4Q6H",
      ledgerCurrency: "EUR",
      sandbox: true,
      // customize the buyer experience
      checkoutLanguage: "en_GB",
      productType: "PayAndShip",
      placement: "Cart",
      buttonColor: "DarkGray",
      estimatedOrderAmount: { amount: "109.99", currencyCode: "USD" },
      checkoutSessionConfig: {
        storeId:
          "amzn1.application-oa2-client.c07c14c065fe4a9aa3e6ee998578e4ac",
        scopes: ["name", "email", "phoneNumber", "billingAddress"],
        paymentDetails: {
          checkoutReviewReturnUrl: "https://www.example.com/checkout-review",
          paymentIntent: "AuthorizeWithCapture",
          canHandlePendingAuthorization: "false",
        },
      },
      // add placeholders for event handlers for user interaction
      /** Invokes when initiated checkout and authenticated **/
      onInitCheckout: function (event) {
        console.warn(event);

        return {
          totalBaseAmount: 100,
          totalShippingAmount: 0,
          totalDiscountAmount: 0,
          totalChargeAmount: 100,
        };
        return event;
        // return initial cart details, total amount, tax, delivery options
      },
      /** Invokes when customer has selected different shipping address **/
      onShippingAddressSelection: function (event) {
        console.warn(event);
        // return updated cart details, total amount, tax, delivery options
      },
      /** Invokes when customer clicks Pay Now **/
      onCompleteCheckout: function (event) {
        console.warn(event);
        // Amazon Pay provides checkout session id, final billing address and payment descriptor.
      },
      /** Invokes when customer has selected different shipping Method **/
      onDeliveryOptionSelection: function (event) {
        console.warn(event);
        // return updated cart details, total amount, tax, delivery options
      },
      /** Invokes when customer abandons the checkout **/
      onCancel: function (event) {
        console.warn(event);
        // take customer back to cart page or product details page based on merchant checkout
      },
    });
  };

  return {
    renderJsButton,
  };
}

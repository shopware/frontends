const { cart, totalPrice } = useCart();
const { currency } = useSessionContext();
const divContainer = ref();

async function renderGooglePay() {
  if (!window?.google?.payments?.api?.PaymentsClient) {
    throw new Error("Google Pay script is not load");
  }

  const {
    isEligible,
    apiVersion,
    apiVersionMinor,
    allowedPaymentMethods,
    merchantInfo,
    countryCode,
  } = await window.paypal.Googlepay().config();

  if (!isEligible) {
    throw new Error("Funding for Google Pay is not eligible");
  }

  const gpClient = new window.google.payments.api.PaymentsClient({
    environment: "PRODUCTION", // or "TEST"
    paymentDataCallbacks: {
      onPaymentAuthorized: async (paymentData) => {
        try {
          await onPaymentAuthorized(paymentData);
          return { transactionState: "SUCCESS" };
        } catch (e) {
          return {
            transactionState: "ERROR",
            error: {
              intent: "PAYMENT_AUTHORIZATION",
              message: e.message || "TRANSACTION FAILED",
            },
          };
        }
      },
    },
  });

  const { result } = await gpClient.isReadyToPay({
    apiVersion,
    apiVersionMinor,
    allowedPaymentMethods,
  });
  if (!result) {
    throw new Error("Browser does not support Google Pay");
  }

  const paymentDataRequest = {
    apiVersion,
    apiVersionMinor,
    allowedPaymentMethods,
    merchantInfo,
    callbackIntents: ["PAYMENT_AUTHORIZATION"],
    transactionInfo: {
      countryCode,
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Grand Total",
      currencyCode: currency.value.isoCode,
      totalPrice: totalPrice.value,
      displayItems: [
        {
          label: "Subtotal",
          price: cart.price.netPrice,
          type: "SUBTOTAL",
        },
        {
          label: "Tax",
          price: cart.price.calculatedTaxes.price,
          type: "TAX",
        },
      ],
    },
  };

  gpClient.prefetchPaymentData(paymentDataRequest);

  const button = gpClient.createButton({
    allowedPaymentMethods,
    onClick: () => {
      // do some form validity checks before continue

      gpClient.loadPaymentData(paymentDataRequest).catch();
    },
  });

  divContainer.appendChild(button);
}

async function onPaymentAuthorized(paymentData) {
  const orderId = await createOrder("googlepay");

  if (!orderId) {
    throw new Error("PayPal order could not be created");
  }

  const confirmOrderResponse = await window.paypal.Googlepay().confirmOrder({
    orderId,
    paymentMethodData: paymentData.paymentMethodData,
  });

  if (
    !["APPROVED", "PAYER_ACTION_REQUIRED"].includes(confirmOrderResponse.status)
  ) {
    throw new Error("PayPal didn't approve the transaction.");
  }

  if ("PAYER_ACTION_REQUIRED" === confirmOrderResponse.status) {
    await window.paypal.Googlepay().initiatePayerAction({ orderId });
  }

  this.onApprove({ orderId });
}

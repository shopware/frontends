import { ref } from "vue";

import { createOrder, getPayPal, onApprove } from "./snippet-context";

const { cart, totalPrice } = useCart();
const { currency } = useSessionContext();
const divContainer = ref<HTMLElement>();

async function renderGooglePay() {
  if (!window?.google?.payments?.api?.PaymentsClient) {
    throw new Error("Google Pay script is not load");
  }

  const paypal = getPayPal();
  const {
    isEligible,
    apiVersion,
    apiVersionMinor,
    allowedPaymentMethods,
    merchantInfo,
    countryCode,
  } = await paypal.Googlepay().config();

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
        } catch (error) {
          return {
            transactionState: "ERROR",
            error: {
              intent: "PAYMENT_AUTHORIZATION",
              reason: "PAYMENT_DATA_INVALID",
              message:
                error instanceof Error ? error.message : "TRANSACTION FAILED",
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

  const paymentDataRequest: google.payments.api.PaymentDataRequest = {
    apiVersion,
    apiVersionMinor,
    allowedPaymentMethods,
    merchantInfo,
    callbackIntents: ["PAYMENT_AUTHORIZATION"],
    transactionInfo: {
      countryCode,
      totalPriceStatus: "FINAL",
      totalPriceLabel: "Grand Total",
      currencyCode: currency.value?.isoCode ?? "EUR",
      totalPrice: String(totalPrice.value),
      displayItems: [
        {
          label: "Subtotal",
          price: String(cart.value?.price?.netPrice ?? 0),
          type: "SUBTOTAL",
        },
        {
          label: "Tax",
          price: String(cart.value?.price?.calculatedTaxes?.[0]?.tax ?? 0),
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

      gpClient.loadPaymentData(paymentDataRequest).catch(() => undefined);
    },
  });

  divContainer.value?.appendChild(button);
}

async function onPaymentAuthorized(
  paymentData: google.payments.api.PaymentData,
) {
  const orderId = await createOrder("googlepay");

  if (!orderId) {
    throw new Error("PayPal order could not be created");
  }

  const confirmOrderResponse = await getPayPal().Googlepay().confirmOrder({
    orderId,
    paymentMethodData: paymentData.paymentMethodData,
  });

  if (
    !["APPROVED", "PAYER_ACTION_REQUIRED"].includes(confirmOrderResponse.status)
  ) {
    throw new Error("PayPal didn't approve the transaction.");
  }

  if ("PAYER_ACTION_REQUIRED" === confirmOrderResponse.status) {
    await getPayPal().Googlepay().initiatePayerAction({ orderId });
  }

  await onApprove({ orderID: orderId });
}

export { renderGooglePay };

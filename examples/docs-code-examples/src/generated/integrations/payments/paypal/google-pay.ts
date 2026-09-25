import { ref, useCart, useSessionContext } from "#imports";

import { createOrder, getPayPal, onApprove } from "./snippet-context";

const { cart, totalPrice } = useCart();
const { currency } = useSessionContext();
const divContainer = ref<HTMLElement | null>(null);

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
        } catch (e) {
          const message = e instanceof Error ? e.message : "TRANSACTION FAILED";
          return {
            transactionState: "ERROR",
            error: {
              reason: "OTHER_ERROR",
              intent: "PAYMENT_AUTHORIZATION",
              message,
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

  const taxTotal =
    cart.value?.price?.calculatedTaxes?.reduce(
      (total, tax) => total + tax.tax,
      0,
    ) ?? 0;

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
      totalPrice: totalPrice.value.toFixed(2),
      displayItems: [
        {
          label: "Subtotal",
          price: (cart.value?.price?.netPrice ?? 0).toFixed(2),
          type: "SUBTOTAL",
        },
        {
          label: "Tax",
          price: taxTotal.toFixed(2),
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

      gpClient.loadPaymentData(paymentDataRequest).catch(() => {});
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

  const paypal = getPayPal();
  const confirmOrderResponse = await paypal.Googlepay().confirmOrder({
    orderId,
    paymentMethodData: paymentData.paymentMethodData,
  });

  if (
    !["APPROVED", "PAYER_ACTION_REQUIRED"].includes(confirmOrderResponse.status)
  ) {
    throw new Error("PayPal didn't approve the transaction.");
  }

  if ("PAYER_ACTION_REQUIRED" === confirmOrderResponse.status) {
    await paypal.Googlepay().initiatePayerAction({ orderId });
  }

  await onApprove({ orderID: orderId });
}

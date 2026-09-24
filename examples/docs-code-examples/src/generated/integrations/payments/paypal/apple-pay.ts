import { ref, useCart, useSessionContext } from "#imports";

import { createOrder, getPayPal, onApprove } from "./snippet-context";

const { totalPrice } = useCart();
const { activeBillingAddress } = useSessionContext();
const divContainer = ref<HTMLElement | null>(null);

async function renderApplePay() {
  if (
    !ApplePaySession.supportsVersion(4) ||
    !ApplePaySession.canMakePayments()
  ) {
    throw new Error("Browser does not support Apple Pay");
  }

  const paypal = getPayPal();
  const {
    isEligible,
    countryCode,
    merchantCapabilities,
    supportedNetworks,
    currencyCode,
  } = await paypal.Applepay().config();

  if (!isEligible) {
    throw new Error("Funding for Apple Pay is not eligible");
  }

  const billingAddress = activeBillingAddress.value;

  if (!billingAddress) {
    throw new Error("Billing address is required for Apple Pay");
  }

  const billingContact: ApplePayJS.ApplePayPaymentContact = {
    addressLines: [billingAddress.street ?? ""],
    administrativeArea: billingAddress.countryState?.name,
    country: billingAddress.country?.iso3,
    countryCode: billingAddress.country?.iso,
    familyName: billingAddress.lastName,
    givenName: billingAddress.firstName,
    locality: billingAddress.city,
    postalCode: billingAddress.zipcode,
  };

  const paymentDataRequest: ApplePayJS.ApplePayPaymentRequest = {
    countryCode,
    merchantCapabilities,
    supportedNetworks,
    currencyCode,
    billingContact,
    requiredShippingContactFields: [],
    requiredBillingContactFields: [],
    total: {
      label: "TOTAL",
      type: "final",
      amount: totalPrice.value.toFixed(2),
    },
  };

  const button = document.createElement("apple-pay-button");
  button.setAttribute("buttonStyle", "black");
  button.setAttribute("type", "buy");
  button.addEventListener("click", () => {
    // do some form validity checks before continue

    const session = new ApplePaySession(4, paymentDataRequest);

    session.onvalidatemerchant = (event) => onValidateMerchant(session, event);
    session.onpaymentauthorized = (event) =>
      onPaymentAuthorized(session, billingContact, event);

    session.begin();
  });

  divContainer.value?.appendChild(button);
}

async function onValidateMerchant(
  session: ApplePaySession,
  event: ApplePayJS.ApplePayValidateMerchantEvent,
) {
  try {
    const paypal = getPayPal();
    const { merchantSession } = await paypal.Applepay().validateMerchant({
      validationUrl: event.validationURL,
    });

    session.completeMerchantValidation(merchantSession);
  } catch (e) {
    session.abort();
  }
}

async function onPaymentAuthorized(
  session: ApplePaySession,
  billingContact: ApplePayJS.ApplePayPaymentContact,
  event: ApplePayJS.ApplePayPaymentAuthorizedEvent,
) {
  try {
    const orderId = await createOrder("applepay");
    const paypal = getPayPal();

    await paypal.Applepay().confirmOrder({
      orderId,
      token: event.payment.token,
      billingContact,
    });

    session.completePayment(ApplePaySession.STATUS_SUCCESS);

    await onApprove({ orderID: orderId });
  } catch (e) {
    session.abort();
  }
}

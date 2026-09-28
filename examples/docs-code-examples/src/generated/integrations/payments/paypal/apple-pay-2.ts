import { ref } from "vue";

import { createOrder, getPayPal, onApprove } from "./snippet-context";

type ApplePaySessionLike = {
  onvalidatemerchant?: (event: { validationURL: string }) => void;
  onpaymentauthorized?: (event: { payment: { token: unknown } }) => void;
  begin: () => void;
  completeMerchantValidation: (merchantSession: unknown) => void;
  completePayment: (status: number) => void;
  abort: () => void;
};

type ApplePaySessionConstructor = {
  new (version: number, paymentRequest: unknown): ApplePaySessionLike;
  supportsVersion: (version: number) => boolean;
  canMakePayments: () => boolean;
  STATUS_SUCCESS: number;
};

const { totalPrice } = useCart();
const { activeBillingAddress } = useSessionContext();
const divContainer = ref<HTMLElement>();

async function renderApplePay() {
  const ApplePaySession = (
    window as unknown as {
      ApplePaySession?: ApplePaySessionConstructor;
    }
  ).ApplePaySession;

  if (
    !ApplePaySession?.supportsVersion(4) ||
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

  const address = activeBillingAddress.value;
  if (!address) {
    throw new Error("Billing address is required for Apple Pay");
  }

  const billingContact = {
    addressLines: [address.street ?? ""],
    administrativeArea: address.countryState?.name,
    country: address.country?.iso3,
    countryCode: address.country?.iso,
    familyName: address.lastName,
    givenName: address.firstName,
    locality: address.city,
    postalCode: address.zipcode,
  };

  const paymentDataRequest = {
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
      amount: String(totalPrice.value),
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
      onPaymentAuthorized(session, billingContact, event.payment.token);

    session.begin();
  });

  divContainer.value?.appendChild(button);
}

async function onValidateMerchant(
  session: ApplePaySessionLike,
  event: { validationURL: string },
) {
  try {
    const { merchantSession } = await getPayPal().Applepay().validateMerchant({
      validationUrl: event.validationURL,
    });

    session.completeMerchantValidation(merchantSession);
  } catch {
    session.abort();
  }
}

async function onPaymentAuthorized(
  session: ApplePaySessionLike,
  billingContact: ApplePayJS.ApplePayPaymentContact,
  paymentToken: unknown,
) {
  try {
    const orderId = await createOrder("applepay");

    await getPayPal().Applepay().confirmOrder({
      orderId,
      token: paymentToken,
      billingContact,
    });

    const ApplePaySession = (
      window as unknown as {
        ApplePaySession: ApplePaySessionConstructor;
      }
    ).ApplePaySession;
    session.completePayment(ApplePaySession.STATUS_SUCCESS);

    await onApprove({ orderID: orderId });
  } catch {
    session.abort();
  }
}

export { renderApplePay };

const { totalPrice } = useCart();
const { activeBillingAddress } = useSessionContext();
const divContainer = ref();

async function renderApplePay() {
  if (
    !window.ApplePaySession?.supportsVersion(4) ||
    !window.ApplePaySession?.canMakePayments()
  ) {
    throw new Error("Browser does not support Apple Pay");
  }

  const {
    isEligible,
    countryCode,
    merchantCapabilities,
    supportedNetworks,
    currencyCode,
  } = await window.paypal.Applepay().config();

  if (!isEligible) {
    throw new Error("Funding for Apple Pay is not eligible");
  }

  const billingContact = {
    addressLines: [activeBillingAddress.street],
    administrativeArea: activeBillingAddress.countryState?.name,
    country: activeBillingAddress.country?.iso3,
    countryCode: activeBillingAddress.country?.iso,
    familyName: activeBillingAddress.lastName,
    givenName: activeBillingAddress.firstName,
    locality: activeBillingAddress.city,
    postalCode: activeBillingAddress.zipcode,
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
      amount: totalPrice.value,
    },
  };

  const button = document.createElement("apple-pay-button");
  button.setAttribute("buttonStyle", "black");
  button.setAttribute("type", "buy");
  button.addEventListener("click", () => {
    // do some form validity checks before continue

    const session = new window.ApplePaySession(4, paymentRequest);

    session.onvalidatemerchant = this.onValidateMerchant.bind(this, session);
    session.onpaymentauthorized = this.onPaymentAuthorized.bind(
      this,
      session,
      billingContact,
    );

    session.begin();
  });

  divContainer.appendChild(button);
}

async function onValidateMerchant(session, event) {
  try {
    const { merchantSession } = await window.paypal
      .Applepay()
      .validateMerchant({
        validationUrl: event.validationURL,
      });

    session.completeMerchantValidation(merchantSession);
  } catch (e) {
    session.abort();
  }
}

async function onPaymentAuthorized(session, billingContact, paymentData) {
  try {
    const orderId = await createOrder("applepay");

    await paypal.Applepay().confirmOrder({
      orderId,
      token: event.payment.token,
      billingContact,
    });

    session.completePayment(window.ApplePaySession.STATUS_SUCCESS);

    this.onApprove({ orderId });
  } catch (e) {
    session.abort();
  }
}

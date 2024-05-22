export function useAmazonPay() {
  const { register: shopwareRegister } = useUser();
  const { getSalutations } = useSalutations();
  const { getCountries, fetchCountries } = useCountries();

  const { data } = useFetch("/api/amazon-pay/init");

  const amazonSessionData = ref<AmazonPaySessionData | null>(null);

  const getNotSpecifiedSalutation = (salutation?: string) => {
    return (
      getSalutations.value?.find(
        (salutation) => salutation.displayName === "Not specified",
      )?.id || ""
    );
  };

  const mapCountryId = (countryCode: string) => {
    const country = getCountries.value.find(
      (country) => country.iso === countryCode,
    );

    console.warn("country", getCountries.value, countryCode);
    return country?.id || "";
  };

  const renderJsButton = async (elementId: string) => {
    console.warn("data", data.value);

    window?.amazon?.Pay.renderButton(elementId, {
      // set checkout environment
      merchantId: "A2XEHS1UKQ4Q6H",
      ledgerCurrency: "EUR",
      sandbox: true,
      // customize the buyer experience
      checkoutLanguage: "en_GB",
      productType: "PayOnly",
      placement: "Product",
      buttonColor: "DarkGray",
      createCheckoutSessionConfig: data.value.result,
      /** Invokes when initiated checkout and authenticated **/
      onInitCheckout: function (event) {
        console.warn("onInitCheckout", event);

        return {
          totalBaseAmount: 100,
          totalShippingAmount: 0,
          totalDiscountAmount: 0,
          totalChargeAmount: 100,
        };
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

  type AmazonPaySessionData = {
    buyer: {
      name: string;
      email: string;
      buyerId: string;
      primeMembershipTypes: null | unknown;
      phoneNumber: string;
    };
    billingAddress: {
      name: string;
      addressLine1: null | string;
      addressLine2: null | string;
      addressLine3: null | string;
      city: string;
      county: null | string;
      district: null | string;
      stateOrRegion: null | string;
      postalCode: string;
      countryCode: string;
      phoneNumber: string;
    };
  };

  const loadSessionData = async (
    checkoutSessionId: string,
  ): Promise<AmazonPaySessionData> => {
    const response = await fetch(
      `/api/amazon-pay/session?checkoutSessionId=${checkoutSessionId}`,
    );
    return await response.json();
  };

  const register = async (checkoutSessionId: string) => {
    await fetchCountries();
    const sessionData = await loadSessionData(checkoutSessionId);

    amazonSessionData.value = sessionData;

    shopwareRegister({
      firstName: sessionData.billingAddress.name?.split(" ")[0],
      lastName:
        sessionData.billingAddress.name?.split(" ")[
          sessionData.billingAddress.name?.split(" ").length - 1
        ] || "",
      email: sessionData.buyer.email,
      guest: true,
      password: "",
      acceptedDataProtection: true,
      accountType: "private",
      salutationId: getNotSpecifiedSalutation(),
      storefrontUrl: "https://frontends-demo.vercel.app",
      billingAddress: {
        salutationId: getNotSpecifiedSalutation(),
        countryId: mapCountryId(sessionData.billingAddress.countryCode),
        street: `${sessionData.billingAddress.addressLine1} \n ${sessionData.billingAddress.addressLine2}`,
        city: sessionData.billingAddress.city,
        zipcode: sessionData.billingAddress.postalCode,
      },
    });
  };

  return {
    renderJsButton,
    register,
    loadSessionData,
    amazonSessionData,
  };
}

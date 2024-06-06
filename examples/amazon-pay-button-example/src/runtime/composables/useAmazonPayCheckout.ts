import { useRoute } from "#imports";
import {
  useUser,
  useCountries,
  useSalutations,
  useCart,
  useCheckout,
  useCustomerOrders,
  useSessionContext,
} from "#imports";
import { computed, ref } from "vue";

export function useAmazonPayCheckout(amazonSessionId?: string) {
  const route = useRoute();

  // get the checkout session id from the URL or from the provided prop
  const checkoutSessionId = computed(
    () => amazonSessionId || route.query?.amazonCheckoutSessionId,
  );

  const { register: shopwareRegister } = useUser();
  const { getSalutations } = useSalutations();
  const { getCountries, fetchCountries } = useCountries();
  const { totalPrice } = useCart();
  const { createOrder, setPaymentMethod, getPaymentMethods } = useCheckout();
  const { loadOrders, orders } = useCustomerOrders();
  const { currency } = useSessionContext();

  const amazonSessionData = ref<AmazonPaySessionData | null>(null);

  const getNotSpecifiedSalutation = () => {
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

    return country?.id || "";
  };

  /**
   * note: this is the expected Amazon session data structure but not entirely described
   */
  type AmazonPaySessionData = {
    merchantMetadata?: {
      merchantReferenceId: string;
    };
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

  // fetch the session data from the server route /api/amazon-pay/session by its checkoutSessionId
  const getSessionData = async (): Promise<AmazonPaySessionData> => {
    const response = await fetch(
      `/api/amazon-pay/session?checkoutSessionId=${checkoutSessionId.value}`,
    );
    return await response.json();
  };

  /**
   * register the customer from the Amazon session data
   */
  const registerCustomerFromAmazonSession = async () => {
    await fetchCountries();
    const sessionData = await getSessionData();

    amazonSessionData.value = sessionData;

    await shopwareRegister({
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
      billingAddress: {
        salutationId: getNotSpecifiedSalutation(),
        countryId: mapCountryId(sessionData.billingAddress.countryCode),
        street:
          sessionData.billingAddress.addressLine1 ||
          sessionData.billingAddress.addressLine2 ||
          "",
        city: sessionData.billingAddress.city,
        zipcode: sessionData.billingAddress.postalCode,
      },
    });

    return sessionData;
  };

  /**
   * set the Amazon payment method (added by an app extension)
   */
  const setAmazonPaymentMethod = async () => {
    const paymentMethods = await getPaymentMethods();
    const amazonPayId = paymentMethods.value?.find(
      (method) =>
        method.shortName === "swag_amazon_pay_app_swag_amazon_pay_app",
    )?.id;
    if (!amazonPayId) {
      throw new Error("Amazon Pay not available");
    }
    await setPaymentMethod({
      id: amazonPayId,
    });
  };

  /**
   * create the order and charge the customer
   */
  const createOrderAndCharge = async () => {
    const order = await createOrder();
    const response = await fetch("/api/amazon-pay/pay", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: checkoutSessionId.value,
        orderNumber: order.orderNumber?.toString(),
        orderId: order.id,
        chargeAmount: {
          amount: totalPrice.value.toString(),
          currencyCode: currency.value?.isoCode,
        },
      }),
    });

    return response.json();
  };

  /**
   * send the complete request to Amazon Pay via server route /api/amazon-pay/complete
   * to complete the payment and update the order payment status
   */
  const complete = async () => {
    const sessionData = await getSessionData();
    await loadOrders({
      associations: {
        transactions: {},
      },
      filter: [
        {
          field: "orderNumber",
          type: "equals",
          value: sessionData.merchantMetadata?.merchantReferenceId,
        },
      ],
    });

    const completeResponse = await fetch("/api/amazon-pay/complete", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orders.value?.[0].id,
        transactionId: orders.value?.[0].transactions?.[0].id,
        amazonCheckoutSessionId: checkoutSessionId.value,
        chargeAmount: {
          amount: orders.value?.[0].amountTotal?.toString(),
          currencyCode: currency.value?.isoCode,
        },
      }),
    });

    return completeResponse;
  };

  return {
    isAmazonPay: computed(() => !!checkoutSessionId.value),
    createOrderAndCharge,
    complete,
    getSessionData,
    registerCustomerFromAmazonSession,
    setAmazonPaymentMethod,
  };
}

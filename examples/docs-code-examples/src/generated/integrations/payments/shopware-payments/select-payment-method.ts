import { useSessionContext } from "#imports";

const { setPaymentMethod } = useSessionContext();

// Store API id of the ShopwarePayments method for this surface:
// PayPal, Pay Later, Apple Pay, Google Pay, or card.
const paymentMethodId = "SHOPWARE_PAYMENTS_METHOD_ID";

await setPaymentMethod({ id: paymentMethodId });

import { useCheckout } from "#imports";

const { getPaymentMethods } = useCheckout();

await getPaymentMethods();

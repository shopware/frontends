import { useCheckout } from "#imports";

const { getShippingMethods } = useCheckout();

await getShippingMethods();

import { usePrice, useProductPrice } from "#imports";

const { totalPrice, price, tierPrices, hasListPrice } =
  useProductPrice(product);
const { getFormattedPrice } = usePrice();

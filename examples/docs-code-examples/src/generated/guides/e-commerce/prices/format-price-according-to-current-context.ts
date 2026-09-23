const price = 12.95;
const { getFormattedPrice } = usePrice();
const priceWithCurrency = getFormattedPrice(price);
// output: 12.95 $

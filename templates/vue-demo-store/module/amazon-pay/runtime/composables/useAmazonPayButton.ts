export async function useAmazonPayButton(elementId: string) {
  const data = await fetch("/api/amazon-pay/init");

  const config = (await data.json()).result;
  window?.amazon?.Pay.renderButton(elementId, {
    merchantId: "A2XEHS1UKQ4Q6H",
    ledgerCurrency: "EUR",
    sandbox: true,
    checkoutLanguage: "en_GB",
    productType: "PayOnly",
    placement: "Cart",
    buttonColor: "DarkGray",
    createCheckoutSessionConfig: config,
  });
}

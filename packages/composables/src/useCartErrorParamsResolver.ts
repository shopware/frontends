export type UseCartErrorParamsResolver = {
  params: any | { name: string; quantity: number };
  messageKey: string;
};

export type ErrorObjectParam = {
  messageKey: string;
  key: string;
};

export function useCartErrorParamsResolver(
  errorObject: ErrorObjectParam,
): UseCartErrorParamsResolver {
  let params = null;
  let messageKey = errorObject.messageKey;

  const { getItem } = useCart();

  const extractProductId = (message: string, error: string) => {
    return message.replace(error, "");
  };

  const buildProductStockReached = () => {
    const productId = extractProductId(
      errorObject.key,
      "product-stock-reached",
    );
    const product = getItem(productId);

    return {
      name: product.label || "",
      quantity: product.quantityInformation?.maxPurchase || "",
    };
  };

  switch (errorObject.messageKey) {
    case "product-stock-reached":
      params = buildProductStockReached();
      if (!params.name || !params.quantity) {
        messageKey = "product-stock-reached-empty";
      }
      break;
    default:
      params = { ...errorObject };
  }

  return {
    params,
    messageKey,
  };
}

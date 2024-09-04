import { useCart } from "#imports";

export type UseCartErrorParamsResolver = {
  resolveCartError: (errorObject: ErrorObjectParam) => {
    params: { [key: string]: string | number | null } | null;
    messageKey: string;
  };
};

export type ErrorObjectParam = {
  messageKey: string;
  key: string;
  message?: string;
  code?: number;
  level?: number;
};

/**
 * @category Cart & Checkout
 *
 * @returns
 */
export function useCartErrorParamsResolver(): UseCartErrorParamsResolver {
  const resolveCartError = (errorObject: ErrorObjectParam) => {
    let params = null;
    let messageKey = errorObject.messageKey;

    const { cartItems } = useCart();

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
        name: product?.label || "",
        quantity: product?.quantityInformation?.maxPurchase || null,
      };
    };

    const getItem = (id: string) => {
      return cartItems.value.find((item) => item.id === id);
    };

    switch (errorObject.messageKey) {
      case "product-stock-reached":
        params = buildProductStockReached();
        if (!params.name || !params.quantity) {
          messageKey = "product-stock-reached-empty";
          params = null;
        }
        break;
      default:
        params = { ...errorObject };
    }

    return {
      params,
      messageKey,
    };
  };
  return {
    resolveCartError,
  };
}

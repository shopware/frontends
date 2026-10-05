import type { CmsActionError } from "@shopware/cms-base-layer-react/client";

import type { Schemas } from "#shopware";

type CartErrorMap = Exclude<
  NonNullable<Schemas["Cart"]["errors"]>,
  Schemas["CartError"][]
>;

export type CartErrorEntry = CartErrorMap[string];

const SUCCESS_CODES = new Set(["promotion-discount-added"]);

const PRODUCT_STOCK_REACHED = "product-stock-reached";
const SHIPPING_METHOD_BLOCKED = "shipping-method-blocked";

function isCartErrorEntry(value: unknown): value is CartErrorEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CartErrorEntry).messageKey === "string"
  );
}

export function getCartErrors(
  cart: Pick<Schemas["Cart"], "errors">,
): CartErrorEntry[] {
  const { errors } = cart;
  if (!errors || Array.isArray(errors)) return [];
  return Object.values(errors).filter(
    (error) => isCartErrorEntry(error) && !SUCCESS_CODES.has(error.messageKey),
  );
}

export function resolveCartError(
  error: CartErrorEntry,
  lineItems: Schemas["LineItem"][],
): CmsActionError {
  switch (error.messageKey) {
    case PRODUCT_STOCK_REACHED: {
      const lineItemId = error.key.replace(PRODUCT_STOCK_REACHED, "");
      const lineItem = lineItems.find((item) => item.id === lineItemId);
      const name = lineItem?.label || "";
      const quantity = lineItem?.quantityInformation?.maxPurchase || null;
      if (!name || !quantity) {
        return { messageKey: `${PRODUCT_STOCK_REACHED}-empty` };
      }
      return { messageKey: PRODUCT_STOCK_REACHED, params: { name, quantity } };
    }
    case SHIPPING_METHOD_BLOCKED:
      return {
        messageKey: SHIPPING_METHOD_BLOCKED,
        params: {
          name: error.message?.replace(`${SHIPPING_METHOD_BLOCKED}-`, "") || "",
        },
      };
    default:
      return { messageKey: error.messageKey, params: { ...error } };
  }
}

export function toCartActionErrors(
  cart: Pick<Schemas["Cart"], "errors" | "lineItems">,
): CmsActionError[] {
  const lineItems = cart.lineItems ?? [];
  return getCartErrors(cart).map((error) => resolveCartError(error, lineItems));
}

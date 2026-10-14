import type { CmsActionError } from "@shopware/cms-base-layer-react/client";

import type { Schemas } from "#shopware";

type CartErrorMap = Exclude<
  NonNullable<Schemas["Cart"]["errors"]>,
  Schemas["CartError"][]
>;

export type CartErrorEntry = CartErrorMap[string];

export type CartErrorLevel = 0 | 10 | 20;

export type CartActionError = CmsActionError & {
  key: string;
  level: CartErrorLevel;
};

export const CART_STATE_ERRORS: ReadonlySet<string> = new Set([
  "shipping-method-blocked",
  "payment-method-blocked",
  "billing-address-blocked",
  "shipping-address-blocked",
  "billing-address-invalid",
  "shipping-address-invalid",
  "promotion-not-eligible",
  "promotion-not-eligible-not-logged-in",
  "promotion-not-eligible-specific-products",
  "promotion-excluded",
  "promotion-discount-zero-value",
  "promotions-on-cart-price-zero-error",
]);

const PROMOTION_NOT_ELIGIBLE = "promotion-not-eligible";

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

function normalizeLevel(level: unknown): CartErrorLevel {
  return level === 0 || level === 10 ? level : 20;
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

function resolveMessage(
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

export function resolveCartError(
  error: CartErrorEntry,
  lineItems: Schemas["LineItem"][],
): CartActionError {
  return {
    ...resolveMessage(error, lineItems),
    key: error.key,
    level: normalizeLevel(error.level),
  };
}

function errorIdentity(error: CartErrorEntry): string {
  return JSON.stringify([error.key, error.messageKey, error.message ?? null]);
}

export function toCartActionErrors(
  cart: Pick<Schemas["Cart"], "errors" | "lineItems">,
  previous?: Pick<Schemas["Cart"], "errors"> | null,
): CartActionError[] {
  const lineItems = cart.lineItems ?? [];
  const known = new Set(
    previous ? getCartErrors(previous).map(errorIdentity) : [],
  );
  return getCartErrors(cart)
    .filter(
      (error) =>
        !CART_STATE_ERRORS.has(error.messageKey) ||
        !known.has(errorIdentity(error)),
    )
    .map((error) => resolveCartError(error, lineItems));
}

export function promotionNotEligibleErrors(
  cart: Pick<Schemas["Cart"], "errors" | "lineItems">,
): CartActionError[] {
  return toCartActionErrors(cart).filter(
    ({ key }) => key === PROMOTION_NOT_ELIGIBLE,
  );
}

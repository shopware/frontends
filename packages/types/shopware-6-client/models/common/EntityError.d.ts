/**
 * @beta
 */
export type ErrorLevel = 0 | 10 | 20;
// NOTICE = 0,
// WARNING = 10,
// ERROR = 20,

/**
 * @beta
 */
export type EntityError = {
  id: string;
  name: string;
  quantity: number;
  message: string;
  code: number;
  key: string;
  level: ErrorLevel;
  messageKey:
    | "product-stock-reached"
    | "product-out-of-stock"
    | "product-not-found"
    | "purchase-steps-quantity"
    | string;
};

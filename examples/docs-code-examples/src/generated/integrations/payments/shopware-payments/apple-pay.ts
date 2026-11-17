import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";
import { requireElement } from "./snippet-context";

const element = requireElement("apple-pay-button");
const APPLE_PAY_METHOD_ID = "APPLE_PAY_METHOD_ID";

await shopwarePayments.applePay({
  element,
  checkout: cartCheckout,
  onApprove: (result) => onApprove(result, APPLE_PAY_METHOD_ID),
  onError,
});

import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";
import { requireElement } from "./snippet-context";

const element = requireElement("apple-pay-button");

await shopwarePayments.applePay({
  element,
  checkout: cartCheckout,
  onApprove,
  onError,
});

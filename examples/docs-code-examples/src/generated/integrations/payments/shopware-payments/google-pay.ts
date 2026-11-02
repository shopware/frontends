import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";
import { requireElement } from "./snippet-context";

const element = requireElement("google-pay-button");

await shopwarePayments.googlePay({
  element,
  checkout: cartCheckout,
  onApprove,
  onError,
});

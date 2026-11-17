import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";
import { requireElement } from "./snippet-context";

const element = requireElement("paypal-button");
const PAYPAL_METHOD_ID = "PAYPAL_METHOD_ID";

await shopwarePayments.buttons({
  funding: "paypal",
  element,
  checkout: cartCheckout,
  onApprove: (result) => onApprove(result, PAYPAL_METHOD_ID),
  onError,
});

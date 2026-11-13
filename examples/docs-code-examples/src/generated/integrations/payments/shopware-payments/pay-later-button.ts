import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";
import { requireElement } from "./snippet-context";

const element = requireElement("paypal-pay-later-button");

await shopwarePayments.buttons({
  funding: "paylater",
  element,
  checkout: cartCheckout,
  onApprove,
  onError,
});

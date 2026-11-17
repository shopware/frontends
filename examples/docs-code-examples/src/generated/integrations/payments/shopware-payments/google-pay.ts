import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";
import { requireElement } from "./snippet-context";

const element = requireElement("google-pay-button");
const GOOGLE_PAY_METHOD_ID = "GOOGLE_PAY_METHOD_ID";

await shopwarePayments.googlePay({
  element,
  checkout: cartCheckout,
  onApprove: (result) => onApprove(result, GOOGLE_PAY_METHOD_ID),
  onError,
});

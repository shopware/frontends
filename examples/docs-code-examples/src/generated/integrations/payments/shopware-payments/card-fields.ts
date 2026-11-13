import { cartCheckout } from "./checkout";
import { shopwarePayments } from "./init";
import { onError } from "./on-error";
import { onApprove } from "./shared-approval";

function field(id: string): HTMLElement {
  const element = document.getElementById(id);

  if (!(element instanceof HTMLElement)) {
    throw new Error(`Add #${id} before rendering card fields`);
  }

  return element;
}

const cardFields = await shopwarePayments.cardFields({
  elements: {
    number: field("card-number"),
    expiry: field("card-expiry"),
    cvv: field("card-cvv"),
  },
  checkout: cartCheckout,
  onApprove,
  onError,
  onBeforeSubmit() {
    return true;
  },
});

document.getElementById("card-pay")?.addEventListener("click", () => {
  void cardFields.submit();
});

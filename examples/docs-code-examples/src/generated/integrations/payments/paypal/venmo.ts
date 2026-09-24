import { createOrder, getPayPal, onApprove } from "./snippet-context";

const paypal = getPayPal();
const divContainer = "#paypal-button-container";

paypal
  .Buttons({
    fundingSource: "venmo",
    createOrder: () => createOrder("venmo"),
    onApprove,

    // ...
  })
  .render(divContainer);

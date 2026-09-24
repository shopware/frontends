import { createOrder, getPayPal, onApprove } from "./snippet-context";

const paypal = getPayPal();
const divContainer = "#paypal-button-container";

paypal
  .Buttons({
    fundingSource: "paylater",
    createOrder: () => createOrder("paylater"),
    onApprove,

    // ...
  })
  .render(divContainer);

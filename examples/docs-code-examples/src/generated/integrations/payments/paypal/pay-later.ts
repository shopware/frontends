import { ref } from "#imports";

const divContainer = ref();

window.paypal
  .Buttons({
    fundingSource: paypal.FUNDING.PAYLATER,
    createOrder: createOrder.bind(this, "paylater"),
    onApprove: onApprove.bind(this),

    // ...
  })
  .render(divContainer);

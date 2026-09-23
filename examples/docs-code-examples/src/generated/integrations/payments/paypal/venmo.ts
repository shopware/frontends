const divContainer = ref();

window.paypal
  .Buttons({
    fundingSource: paypal.FUNDING.VENMO,
    createOrder: createOrder.bind(this, "venmo"),
    onApprove: onApprove.bind(this),

    // ...
  })
  .render(divContainer);

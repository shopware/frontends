const divContainer = ref();

// client only
window.paypal
  .Buttons({
    /** configuration skipped */
  })
  .render(divContainer);
// this script will mount the component in element `divContainer`

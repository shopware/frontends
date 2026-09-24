import { loadScript } from "@paypal/paypal-js";

loadScript({
  clientId: "your-paypal-client-id",
  // Pay Later or Venmo.
  enableFunding: "paylater,venmo",
  // ACDC, Apple Pay or Google Pay.
  components: "card-fields,applepay,googlepay",
  // other options
});

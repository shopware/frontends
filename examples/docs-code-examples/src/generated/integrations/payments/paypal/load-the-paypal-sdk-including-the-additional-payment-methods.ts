import { loadScript } from "@paypal/paypal-js";

loadScript({
  // Pay Later or venmo
  "enable-funding": "paylater,venmo",
  // ACDC, Apple Pay or Google Pay
  components: "card-fields,applepay,googlepay",
  ...
});

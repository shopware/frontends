import { loadScript } from "@paypal/paypal-js";

loadScript({
  // client id is generated in the PayPal account's apps section
  clientId:
    "AUAcLFoadrmy9JiW2cHgriy1mTy0MCqQOP_1SSeQEUArz_zPeF1VcNY2CCxcFBQpf_N4g1k5wFVNJ1Bk",
  // Pay Later or venmo
  enableFunding: "paylater,venmo",
  // ACDC, Apple Pay or Google Pay
  components: "card-fields,applepay,googlepay",
});

---
"vue-starter-template": patch
---

Fix starter checkout guest orders and client-side validation

Checkout now validates email and address on submit even when the fields were never focused, so an empty form no longer hits the Store API. Guest checkout is the default again, with a "Continue as guest" control after "Create customer account", zip/state rules, and place-order blocked until the customer form is valid.

Point `devStorefrontUrl` at `https://frontends-starter-template.vercel.app` so registration and confirmation emails use the starter demo domain instead of the deprecated demo-store URL.

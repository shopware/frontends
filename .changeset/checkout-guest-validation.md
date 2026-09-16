---
"vue-starter-template": patch
---

Fix starter checkout guest orders and client-side validation

Checkout now validates email and address on submit even when the fields were never focused, so an empty form no longer hits the Store API. Guest checkout is the default again, with a "Continue as guest" control after "Create customer account", zip/state rules, and a single "Confirm and place order" action that creates the guest session then the order.

Point `devStorefrontUrl` at `https://frontends-starter-template.vercel.app`. Guest register still needs a URL that exists under **Sales Channel → Domains**; `getStorefrontUrl()` now falls back to a domain from the session context when the preferred URL is not listed, so checkout can reach `POST /checkout/order`.

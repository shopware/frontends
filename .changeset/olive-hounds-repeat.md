---
"@shopware/cms-base-layer": patch
---

Write listing filters to the URL before fetching, so a slow or failed request no longer leaves the selection out of the address bar. Also expose the product id on the add-to-cart button, so a test can assert which variant reached the cart.

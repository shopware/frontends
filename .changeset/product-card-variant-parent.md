---
"@shopware/cms-base-layer": patch
---

Show "Details" instead of "Add to cart" for variant parents, and show success only when the product is in the cart. A product with a single price tier now shows "Add to cart", like in the Twig storefront.

New translation key: `product.notAddedToCart`. Variant parents now use `product.details`. Add both to your locale files.

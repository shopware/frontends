---
"vue-demo-store": patch
---

Read translatable entity fields through their `translated` object instead of the untranslated entity root, so they follow the language of the current request instead of rendering the system language. Affected: salutation `displayName` in the address, registration, checkout customer and checkout salutation selects; payment method `name` and `description` in `AccountOrderDetailChangePaymentModal`; delivery time `name` in `AccountOrderDetailShippingMethodInfo` and on the checkout success page; breadcrumb `name` in `LayoutBreadcrumbs`; category `name` in `LayoutSideMenu`; property group option `name` in `ListingFiltersProperties` and `ProductCard`; country `name` in `SharedCountryStateInput`; product sorting `label` on the search page; payment method `shortName` in the checkout logo `alt`; and currency `symbol` in `AccountOrder`.

Delivery times now use the existing `getShippingMethodDeliveryTime()` helper, everything else `getTranslatedProperty()`. Both fall back to the root property when `translated` is missing, so the rendered value only changes on storefronts whose language differs from the system language.

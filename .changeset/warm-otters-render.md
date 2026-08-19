---
"vue-starter-template": patch
---

Read translatable entity fields through their `translated` object instead of the untranslated entity root, so they follow the language of the current request instead of rendering the system language. Affected: order state `name` in `AccountOrderLine`; payment method `name` and `description` in `AccountOrderDetailChangePaymentModal`; payment method `description` in `CheckoutPaymentMethods`; delivery time `name` in `AccountOrderDetailShippingMethodInfo` and on the checkout success page; salutation `displayName` in `FormSalutationSelect`; breadcrumb `name` in `LayoutBreadcrumbs`; category `name` in `LayoutHeaderTopNavigationSubcategories`; product `name` in `WishlistProductTile`; and currency `symbol` in `useCurrencySwitcher`.

Delivery times now use the existing `getShippingMethodDeliveryTime()` helper, everything else `getTranslatedProperty()`. Both fall back to the root property when `translated` is missing, so the rendered value only changes on storefronts whose language differs from the system language.

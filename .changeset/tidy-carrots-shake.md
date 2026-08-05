---
"@shopware/composables": patch
---

`usePrice` now formats in the shop's display language from the session context (`languageInfo.localeCode`) instead of the browser locale.

This restores the currency symbol: `Intl` only emits a native symbol when the locale knows it, so PLN formatted with `en-US` rendered `PLN 1,234.56` instead of `1234,56 zł`. Same for CZK, SEK, DKK, HUF and NOK. Server and client output now match, so prices in cached HTML are correct for every visitor.

Also: the `Intl.NumberFormat` instance is cached instead of rebuilt on every call, and an invalid locale falls back to the browser locale instead of throwing.

Precedence: explicit `localeCode` > session context > browser locale. Pass `localeCode` to `usePrice()` if your shop language does not match its currency.

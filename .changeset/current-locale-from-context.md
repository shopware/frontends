---
"@shopware/composables": minor
---

`useSessionContext`: expose `currentLocaleCode` — the active language's locale code (e.g. `"en-GB"`), read directly from the context's `languageInfo`. The current locale can now be derived from the session context alone, without loading the full language list via `useInternationalization().getAvailableLanguages()` just to map the current `languageId` to a locale.

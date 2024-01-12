---
"@shopware-pwa/cms-base": minor
---

Moved cms helper functions:

- buildUrlPrefix - moved to helpers package, see `packages/helpers/src/cms/buildUrlPrefix.ts`.
- deepMerge - **removed** (use defu instead)
- getCmsTranslations - move to composables as `useCmsTranslations`
- getUrlPrefix - move to composables as method in `useUrlResolver`
- resolveUrl - move to composables as method in `useUrlResolver`

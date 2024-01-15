---
"@shopware-pwa/cms-base": minor
---

Moved cms internal helper functions:

- `buildUrlPrefix` - moved to helpers package, see `packages/helpers/src/cms/buildUrlPrefix.ts`.
- `getCmsTranslations` - move to composables as `useCmsTranslations`
- `getUrlPrefix` - move to composables as method in `useUrlResolver`
- `resolveUrl` - move to composables as method in `useUrlResolver`

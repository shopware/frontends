---
"@shopware/nuxt-module": patch
---

Register the `#shopware` types in every TypeScript context (app, server/nitro, node, shared) instead of only the app one. This fixes `Cannot find module '#shopware'` in server-side code (e.g. `server/` routes and API builders) when a project uses the Nuxt 4 project-references `tsconfig.json` layout. Projects that ship their own `shopware.d.ts` are referenced in place so their relative imports keep resolving.

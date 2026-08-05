---
"@shopware/cms-base-layer": patch
---

Stop leaking internal types into the layer's public type surface.

- `index.d.ts` now only augments the app config. It no longer re-exports `@shopware/composables` and `./.nuxt/imports`.
- The `#imports` shim moved to a private `types/imports.d.ts`, which is not published.
- `app.config` exports a plain object with `satisfies AppConfigInput` instead of calling `defineAppConfig`. No runtime change.

This fixes `Cannot find name 'ref'` and similar errors in the shared and node contexts when a project uses the Nuxt 4 project-references `tsconfig.json`.

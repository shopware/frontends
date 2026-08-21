---
"@shopware/cms-base-layer": patch
---

Ship `component-dirs.json` in the published package. `nuxt.config.ts` imports it at load time, but it was missing from `files`, so the layer failed to load when installed from the registry.

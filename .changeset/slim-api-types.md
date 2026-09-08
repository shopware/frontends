---
"@shopware/api-client": patch
"@shopware/api-gen": patch
---

Stop committing generated `storeApiTypes.d.ts` copies in examples and templates. Override-only projects merge a small `*.overrides.ts` onto the types shipped with the api-client via `WithApiOverrides`, so StackBlitz still typechecks without a generate step.

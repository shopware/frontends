// `#imports` shim for type-checking this layer on its own. Nuxt only generates its own
// auto-imports into `.nuxt/imports.d.ts`, so the @shopware/composables ones the components
// rely on have to be added here. Resolved from the package root, the same entry consumers
// get, so this check cannot pass against a stale `dist` while apps break on `src`.
export * from "@shopware/composables";
export * from "../.nuxt/imports";

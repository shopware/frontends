// `#imports` shim for type-checking this layer on its own. Nuxt only generates its
// own auto-imports into `.nuxt/imports.d.ts`, so the @shopware/composables ones the
// components rely on have to be added here. Built types, not `src`, so this does not
// pull the composables sources into the program.
export * from "@shopware/composables/lib";
export * from "../.nuxt/imports";

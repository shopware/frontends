---
"@shopware/cms-base-layer": major
---

Make the package a plain Nuxt layer.

**Breaking:** the package now declares an `exports` map, so only the layer entry point
is importable. Deep imports such as
`@shopware/cms-base-layer/app/components/SwProductCard.vue` no longer resolve. Use the
auto-registered global components instead, which is what extending the layer gives you.

**Breaking:** the leftover Nuxt module is gone, so `index.cjs` and the `dist` build are
no longer published. The module registered a component folder that moved to `app/` a
while ago, so it could not work any more. Consume this package with `extends`, which
resolves `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: ["@shopware/cms-base-layer"],
});
```

Other changes:

- Dropped the `build` and `dev` scripts and the `unbuild` dev dependency. There is
  nothing left to bundle.
- Fixed `files`. It listed `helpers` and `app.config.ts`, which do not exist at the
  package root, and shipped the dead `dist` and `index.cjs`.
- Deleted `components.d.ts`. It typed two components at paths that moved to
  `app/components/public/cms/`, and no tsconfig referenced the file.
- Removed two vitest aliases that pointed at files which do not exist.
- Removed the `check-colors` script. It read `uno.config.ts` from this package, which
  moved to `@shopware/unocss-design-tokens-layer`, so it always found zero colors. It
  also relied on `tsx` without declaring it.

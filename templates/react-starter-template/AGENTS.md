# react-starter-template

Next.js App Router storefront template for Shopware 6, the React counterpart of
`vue-starter-template`. It is at the skeleton stage: no data layer, routing or
CMS rendering yet. `supportLevel` in `templates/manifest.json` is authoritative.

## Next.js docs

Next.js ships docs that match the installed version in
`node_modules/next/dist/docs/`. Read the relevant guide there before writing
Next.js code: 16.3 differs from most training data (Cache Components,
`proxy.ts` instead of `middleware.ts`, async request APIs).

`agentRules` is `false` in `next.config.ts`, so `next dev` does not write its
own `AGENTS.md` block or a `CLAUDE.md` pointer file. The repository keeps
`AGENTS.md` files only.

## Rules the code does not show

- Cache Components are on. A catalog route must never read `cookies()` or
  `headers()`: that silently makes the route dynamic, and its HTML stops being
  cacheable.
- On the server, create one `@shopware/api-client` instance per request. An
  instance adopts the `sw-context-token` of every response, so a shared one
  leaks sessions between users.
- Colors come from `@shopware/design-tokens` (`tailwind.css`, `@theme static`).
  The class names match the Vue templates (`bg-brand-primary`,
  `text-surface-on-surface`), so markup ports between them. Add or change a
  color in that package, not here.
- The template reads `@shopware/design-tokens` from its build output, and
  `unbuild --stub` does not work in Next.js client bundles. After changing the
  package, rebuild it: `pnpm --filter @shopware/design-tokens build`.
- `@shopware/design-tokens` is linked with `workspace:*` until it is published,
  which is why the template is not scaffoldable yet.

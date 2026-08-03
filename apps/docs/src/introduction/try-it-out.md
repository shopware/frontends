---
head:
  - - meta
    - name: og:title
      content: Try It Out
  - - meta
    - name: og:description
      content: "Pick a Shopware Frontends template and an environment, then launch a working storefront in seconds."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Try%20It%20Out?fontSize=150px"
nav:
  position: 5
  title: Try it out
---

# Try It Out

Pick a template and an environment to launch a working storefront. The whole flow is read-only friendly — feel free to look around before you change anything.

<TryItOutPicker />

## What to expect during boot

- **The dev server starts on port `3000`.** The environments above auto-forward it; once it's ready, the preview opens automatically.
- **First boot is slower than subsequent boots.** Cold installs fetch the workspace, run `pnpm install`, then `pnpm run dev`.
- **Some warnings are normal.** They don't block startup. See the FAQ below if a warning looks alarming.

## Known warnings (safe to ignore)

::: details EBADENGINE / Node engine warnings
Some packages declare a Node `engines` range stricter than the sandbox provides. The starter is tested against Node 22 and runs fine; the warning is informational. We're tracking [#2360](https://github.com/shopware/frontends/issues/2360) to silence these on first run.
:::

::: details Peer dependency warnings (`@tresjs/core` / `@tresjs/cientos`)
These appear in some package-manager combinations. They don't affect the storefront — 3D content lazy-loads only when CMS pages opt into the spatial viewer. Tracked in [#2360](https://github.com/shopware/frontends/issues/2360).
:::

::: details Deprecation warnings on first install
A few transitive dependencies emit deprecation warnings. They're upstream and will be cleared as we bump dependency versions. Not a blocker.
:::

## After it's ready

Once the preview is up:

- The home page should render — that confirms the storefront is wired correctly to the demo Shopware backend.
- Navigate into a category or a product to see CMS-driven content.
- Open `app/` in the editor for components and pages — that's where your customizations live.

<PageRef page="./templates/vue-starter-template.html" title="Vue Starter Template — full guide" sub="Production-ready foundation for custom storefronts" />
<PageRef page="./templates/vue-starter-template-extended.html" title="Vue Starter Template Extended — full guide" sub="Branded demo built with Nuxt layers on top of the starter" />

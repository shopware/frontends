<div align="center">

<img src=".readme/shopware-frontends-logo.png" />

</div>

<p align="center">
<a href="https://frontends-demo.vercel.app/" target="_blank">🚀 Demo</a> | 📚 <a href="https://frontends.shopware.com/" target="_blank">Docu</a> | <img style="position:relative; top:3px;" src="https://d33wubrfki0l68.cloudfront.net/9a3dab7d5789ca17d6b0b9af993d40a26be9e5b6/a0243/img/theme/docs-logo.svg" width="16"> <a href="https://stackblitz.com/github/shopware/frontends/tree/main/templates/vue-demo-store" target="_blank">Try it out</a> | 💬 <a href="https://github.com/shopware/frontends/discussions">Discuss</a> | <img style="display: inline-block;-webkit-user-select: none;margin: auto;cursor: zoom-in;background-color: hsl(0, 0%, 100%);transition: background-color 300ms; position:relative; top:3px;" src="https://previews.us-east-1.widencdn.net/preview/48045879/assets/asset-view/d6656443-dc9b-4e17-b45f-64941fcec7c8/thumbnail/eyJ3IjoyMDQ4LCJoIjoyMDQ4LCJzY29wZSI6ImFwcCJ9?Expires=1691668800&Signature=re7EnFX8gwpSpiDfWq8j4KZ0M2WrCZ65HWRgJNdhelDexNiuXPmfxJyMLju1DrOVXcrg8~tv~7v8~HXMXDVpS3cftYJhF-gVo1PnxHjaes5HURuQBfG0HZTRGEEsWBZEVpAuU1td7kgvEcz5ljVnsEG9b8QPD~bBr27cP0ykX1ki7amuX~iQmFd1Z1M9ixwoj8mRBK7CsYJhriYYS4YiD4cSSY16mCOy6qKw96FLXuRkCEsS6vgC4oa7t6UioCUgZBD8odxda0Y1ouiDzpJ9gpcUcA7fDdgSwlafIW7eKcj185GtzPcmbddt30tJiwoCwc9fRq0xBLO4K3crGZnv0Q__&Key-Pair-Id=APKAJM7FVRD2EPOYUXBQ" width="16"> <a href="https://shopwarecommunity.slack.com/archives/C050L6NCMGQ" target="_blank">Channel</a>
</p>

<p align="center">
	Shopware Frontends is Shopware's Vue.js <strong>framework</strong> for building custom storefronts.
</p>

---

## Getting started

Node.js v16 or v18 and pnpm are required to run the project.

```sh
# Install dependencies
pnpm i

# Build packages
pnpm run build --filter='./packages/*'

# Run project base
pnpm run dev --filter=vue-demo-store
```

### Run and develop docs

```sh
pnpm run dev --filter='docs'
```

## Architecture

Shopware Frontends is a framework which is divided into separate modules of which some can be used independently.

![Shopware Frontends Architecture](.readme/frontends-architecture.png)

**API Client**

This package provides abstraction to Shopware's Store API and manages authentication state and request/response schemas.

**Composables**

An opinionated set of Vue.js composables like `useProduct` or `useCustomer` to use business logic and state in any Vue.js project.

**CMS Base**

An implementation of all default Shopware Sections, Blocks and Elements in Tailwind.css.

**Helpers**

A set of helper functions related to price formatting, translation handling, UI state, or URL handling.

**Project Templates**

We offer different project templates to get started with Shopware Frontends.

Our demo store template is a non-production-ready reference implementation of an eCommerce storefront, based on Tailwind.css and Nuxt 3.

![Shopware Frontends Techstack](.readme/shopware-frontends-techstack.png)

See the [templates](templates/) section for other project templates and how to use them.

## Key Features

Shopware Frontends combines the best of the worlds of frontend development, Shopware 6 and your business requirements.

### Shopware native

Shopware Frontends is built for Shopware 6.
No compromises or generic implementations — it works just you would expect it to.
Core concepts like content management, checkout, or payment are deeply integrated and fully functional

### Cloud first

Shopware Frontends is designed to work only with HTTP APIs available in Shopware Cloud.
No themes, plugins or server access required.
Even your developer IDE can be started in the cloud.

### Stable

Shopware Frontends doesn’t rely on Shopware’s volatile internal APIs (such as twig blocks, DAL or Events),
hence not being subject to breaking changes in those APIs, as opposed to Twig Storefront themes.
Especially for big frontend projects this drastically reduces the complexity of platform updates.

### Efficient

There is no lock-in on technologies or frontend tooling. Shopware Frontends comes prepared with a smart default of tooling.
Vue3, Vite, Nuxt3 and unocss (Tailwind.css) — each by themselves coming with a rich ecosystem of tooling, extensions
and integrations can be replaced and extended to meet any projects needs. This tech-stack is the definition of superior Developer Experience and rapid prototyping.

### Flexible

No theming system means no inheritance magic, no compatibility issues, no update efforts, no restrictions
to what your site can look like. Build your site in a lego-block-manner by using prepared templates
or just get creative using all of Tailwind.css’ features.

### Fast

Shopware Frontends is fast during development, deployment and production. It applies server-side-rendering
wherever possible — code splitting, below-the-fold-rendering, and lazy-loading are built into the frontend.
Common metrics like page speed and lighthouse scores are constantly monitored.

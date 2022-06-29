<div align="center">

<img src=".readme/shopware-frontends-logo.png" />

</div>

<p align="center">
	Shopware Frontends is a <strong>framework</strong> for building custom, cloud-native Shopware Storefronts.
</p>

---

## Getting started

```sh
# Install dependencies
pnpm i

# Build packages
pnpm run build

# Run project base
pnpm run dev --filter=nuxt3-app
```

## Structure

Shopware Frontends is divided into three main modules.

**API Client**

This package provides abstraction to Shopware's Store API and manages authentication state and request/response schemas.

**Composables**

An opinionated set of Vue.js composables like `useProduct` or `useCustomer` to use business logic and state in any Vue.js project.

**Project Base**

A reference implementation of an eCommerce storefront, based on Tailwind.css, Vite, Nuxt 3 and Vue 3.

![Shopware Frontends Techstack](.readme/shopware-frontends-techstack.png)

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

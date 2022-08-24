# Why Shopware Frontends

Shopware **Frontends** is a framework for building custom, cloud-native Shopware Storefronts.

Instead of attempting to be a turn-key, hyper-configurable storefront, **Frontends** combines Shopware’s headless approach with a thoughtful set of tools and and best practices from modern frontend development to get the most out of Shopware and its APIs.

A storefront is only one part of Shopware **Frontends**. There are underlying components equipped for framework-agnostic usage (e.g. React, Svelte or Vue.js) or even broader usage, such as mobile applications or IoT cases which are solely based on our API.

➡ [Also see its limitations](#limitations)

## Shopware native

Shopware **Frontends** is built for Shopware 6.

No compromises or generic implementations — it works just like a developer would expect it to.
Core concepts like [content management](./getting-started/content-pages.md), [cart](./getting-started/cart.md), or [payment](./getting-started/checkout.md) are deeply integrated and fully functional.

## Cloud first

Shopware **Frontends** is designed to work only with HTTP APIs available in [Shopware Cloud](./index.md#data-sources).
No themes, plugins or server access required.
Even the [developer IDE](./getting-started/templates/demo-store-template.md) can be started in the cloud.

## Stable

Shopware **Frontends** [doesn’t rely on Shopware’s internal APIs](./index.md#how-it-works) (such as twig blocks, DAL or events),
hence not being subject to breaking changes in those APIs — as opposed to theme-based storefronts.
Especially for big frontend projects this drastically reduces the complexity of platform updates.

## Efficient

There is no lock-in on technologies or frontend tooling. Shopware **Frontends** comes prepared with a smart default of tooling.
Vue3, Vite, Nuxt3 and unocss/Tailwind.css — each by themselves coming with a rich ecosystem of tooling, extensions
and integrations can be [replaced and extended](./getting-started/templates.md) to meet any projects needs.

This tech-stack is the definition of superior developer experience, quick learning and rapid prototyping.

## Flexible

No theming system means no inheritance magic, drastically reduced compatibility issues, update efforts, and restrictions
to what your site can look like. Build your site in a lego-block-manner by using [prepared templates](./examples/index.md) or just get creative using all perks of [utility-driven CSS](./framework/styling.md).

## Limitations

Shopware Frontends is a framework and not a finished product. Even it the [demo store template](./getting-started/templates/demo-store-template.md) looks like a proper store, it's not an off-the-shelf solution.

In contrast to Shopware's Twig Storefront, Shopware Frontends is not compatible with any apps, themes or plugins. If you want to use third party extensions, you need to ensure that they come with useful Store API endpoints and implement the frontend logic and UI yourself.

We recommend having profound knowledge of Vue.js or another reactive Javascript framework and experience with headless frontend architecture when you plan to implement a project with Shopware Frontends.

---

<PageRef page="../getting-started/templates" title="Getting Started" sub="Get started with Shopware Frontends" />

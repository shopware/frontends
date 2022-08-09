---
---

# Setup Templates

Shopware Frontends offers two shortcuts to getting started with your custom frontend. These so-called templates offer different levels of "completeness" of a project.

## Demo Store Template

<img src="../.assets/demo-store-template.jpg" alt="Demo Store Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" />

:::info
The **Demo Store Template** is not a fully-functional online store. It is only a reference implementation that contains most of the features which you can use as a starting point. It is not possible to update it automatically or install Shopware extensions on it.
:::

The demo store template is a reference implementation of an online store UI. It comes with all default features implemented as boilerplate code - such as

- Navigation & Header
- Cart
- Checkout
- CMS Pages

It is based on Nuxt3 and Tailwind.css.

[TODO: Add command or instructions to set up demo store template]

<PageRef page="./templates/demo-store-template" title="Get started with the Demo Store Template" sub="A reference implementation of a store based on Vue.js" />

## Blank Template

<img src="../.assets/blank-template.jpg" alt="Demo Store Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" />

If you like to start from scratch, you can use the blank template. It can be handy if you want to use a different CSS framework or create a completely new frontend, but leverage the built-in functionality of all Shopware Frontends packages.

The blank template has all "non-UI" packages pre-installed, but you have to bring your own styles and components.

[TODO: Add command or instructions to set up blank template]

<PageRef page="./templates/blank-template" title="Get started with the Blank Template" sub="A blank Nuxt.js project pre-installed with all packages" />

## Custom project

If you want to integrate Shopware Frontends into an existing projects or start from scratch, follow the steps below:

```bash
npm install @shopware-pwa/frontends
```

In order to use Shopware Frontends packages in your application, you have to hook them into your project.

If you choose to do it in your own project, we assume you know how to do it exactly - hence we will just show an example of how to do it in a fresh Vite.js application:

TODO: Add command or instructions to set up custom project with frontends composables

```js
import { createApp } from "@shopware-pwa/frontends";
```

After your setup, you can follow our building guides to get started with Shopware Frontends

<PageRef page="../getting-started/navigation" title="Getting Started - Navigation" sub="Let's implement a store navigation" />

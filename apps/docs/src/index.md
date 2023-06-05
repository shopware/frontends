---
sidebar: true
nav:
  title: Shopware Frontends
  position: 10
  links:
    - text: Shopware Frontends
      items:
        - link: /frontend/
          text: Overview
        - link: /frontend/why-shopware-frontends.html
          text: Why Shopware Frontends
      position: 5
---

# How Shopware frontends work?

Frontends is a collection of multiple packages that you can use to implement your custom storefront project.

<img src=".assets/frontends-architecture.png">

## Data Sources

Shopware 6 is considered one "supported" data source, but you can integrate any other data source you like - such as CMS or analytics. Shopware Frontends uses the Store API to connect with your Shopware 6 instance at runtime.

## Logic

A big part (and a risk factor) of every custom storefront project is the implementation of domain-specific business functionality. That's why Shopware Frontends offers various packages that take care of some heavy lifting:

- Routing
- Shopping worlds (Shopware CMS) integration
- Product searches and filters
- Price formatting
- Authentication & state handling

It also comes with TypeScript support.

## Template/UI

You can decide to start from scratch and use no template at all, but we recommend looking at our [Templates](./getting-started/templates.md) which are based on **Nuxt.js** and **Tailwind CSS**.

<PageRef title="Internal Structure" sub="Details about the internal structure of Shopware Frontends" page="/framework/internal-structure" />

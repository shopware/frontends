# Custom React project

:::info
This template is a prototype. It shows how to integrate Composable Forntends into React.
::::

<a href="https://shopware-vercel-commerce-react.vercel.app/" target="_blank"><img src="../../.assets/vercel-commerce-demo-shopware-composable-frontends.png" alt="Vercel Commerce Demo Store Template Screenshot" class="border-1px border-#eeeeee rounded-md shadow-md my-8 hover:shadow-2xl hover:scale-105 transition duration-200" /></a>

## About this project

- **React** and **Next.js** with **App Router**
- It is based on the [vercel-commerce](https://github.com/shopwareLabs/vercel-commerce) template
- It uses the new [api-client](https://www.npmjs.com/package/@shopware/api-client)
- There is **no headless checkout**, we are currently working on supporting the default checkout
- Each page is currently **pre-generated** during build time
  - Vercel supports building partial pages after updating when sending a webhook
  - This feature was not tested with Shopware (see API endpoint [here](https://github.com/shopwareLabs/vercel-commerce/blob/main/lib/shopware/index.ts#L302))

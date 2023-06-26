---
head:
  - - meta
    - name: og:title
      content: "3rd party integration"
  - - meta
    - name: og:description
      content: "Collection of good practices to integrate 3rd party codes."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/3rd%20party%20integration 🖼.png?fontSize=110px"
nav:
  position: 60
---

# 3rd party integration

:::info
Creating plugin is not required. You can add a script from any component. But for better structure and code control, we recommend using the plugin
:::

Go to `plugins` directory and create plugin file `x.client.ts`

```ts
export default defineNuxtPlugin((NuxtApp) => {
  useHead({
    script: [
      {
        src: "https://<url>",
        defer: true,
      },
    ],
  });
});
```

Sometimes integration requires adding more complicated js code to the app. In this case, we recommend adding a new module with a component and using it in-app.

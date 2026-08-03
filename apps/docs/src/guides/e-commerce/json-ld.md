---
head:
  - - meta
    - name: og:title
      content: "JSON-LD"
  - - meta
    - name: og:description
      content: "How to use JSON-LD with the Shopware Composable Frontends"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/JSON-LD.png"
---

# JSON-LD

JSON-LD (JavaScript Object Notation for Linked Data) is a method of encoding Linked Data using JSON. It is a way to create machine-readable data from websites.

In the context of e-commerce, JSON-LD plays a crucial role in improving the visibility of the website to search engines. It allows search engines to understand the content on the website, leading to better SEO (Search Engine Optimization) results.

For example, JSON-LD can be used to provide detailed product information such as price, availability, and review ratings in a structured format that search engines understand. This can lead to rich results or rich snippets, where search engines display more than just the standard search result information, potentially increasing click-through rates and online visibility.

## JSON-LD in Vue demo store

The Vue demonstration store incorporates a specific composable, `useProductJsonLD.ts`, which facilitates the integration of JSON-LD structured data into the product page.

As first parameter composable takes product object.

```ts
useProductJsonLD(productResponse.value.product);
```

### Extending

```ts
useProductJsonLD(productResponse.value.product, {
  brand: {
    "@type": "Brand",
    name: "Test",
  },
});
```

---
head:
  - - meta
    - name: og:title
      content: "Associations"
  - - meta
    - name: og:description
      content: "How to work with associations"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Associations.png?fontSize=110px"
nav:
  position: 40
---

# Associations

Not all of the properties are added to the response by default. Some of them have to be added manually

:::warning
Please remember that adding too many fields can affect the response time
:::

More about [associations](https://shopware.stoplight.io/docs/store-api/cf710bf73d0cd-search-queries#associations) can be found here

## Product

```ts
const { search } = useProductSearch();

const productResponse = await search(props.navigationId, {
  withCmsAssociations: true,
  criteria: {
    associations: {
      manufacturer: {},
      properties: {},
    },
  },
});
```

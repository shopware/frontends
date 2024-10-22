---
head:
  - - meta
    - name: og:title
      content: Fetching Media - Shopware Frontends
  - - meta
    - name: og:description
      content: "Fetching Media (CMS)"
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Fetching%20Media?fontSize=150px"
---

# Fetching Media (CMS)

To fetch Media objects you can use `readMedia post /media` endpoint.

## Example

```ts
const { data } = await apiClient.invoke("readMedia post /media", {
  body: {
    ids: ["a69d392ee875484095bf0b20b20c842b"],
  },
});
```

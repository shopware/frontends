---
head:
  - - meta
    - name: og:title
      content: "Best practices: Performance"
  - - meta
    - name: og:description
      content: "Collection of good practices to help you provide a reliable application."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Best%20practices:%20**Performance**.png?fontSize=110px"
nav:
  position: 20
---

# Performance

## Lighthouse performance checklist

Below is a list of items that you can use to quickly audit the performance of your application. This list is not exhaustive, but rather a starting point.

:::warning
Please remember that the Lighthouse score should be checked only on the production build.
:::

### Performance

- Images have appropriate resolution
- Images are in `WebP` format
- Third part code is loaded asynchronously
- Images are lazy loaded
- All custom event listeners are destroyed with their components

### Accessibility

- All images are described by `alt` attribute
- Contrast is correct
- `aria-label` are added to HTML tags

### Best Practices

- `https` connection is used
- Page follows a semantic HTML structure

### SEO

- `robots.txt` is added
- All pages have metadata (title, description, tags)

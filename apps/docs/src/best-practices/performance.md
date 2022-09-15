# Performance

## Lighthouse performance checklist

:::warning
Please remember that the Lighthouse score should be checked only on the production build.
:::

### Performance

- [ ] images have appropriate resolution
- [ ] images are in `WebP` format
- [ ] third part code is loaded asynchronously
- [ ] images are lazy loaded
- [ ] all custom event listeners are destroyed with their components

### Accessibility

- [ ] all images are described by `alt` attribute
- [ ] contrast is correct
- [ ] `aria-label` are added to HTML tags

### Best Practices

- [ ] `https` connection is used
- [ ] semantic html structure

### SEO

- [ ] `robots.txt` is added
- [ ] all pages have metadata (title, description, tags)

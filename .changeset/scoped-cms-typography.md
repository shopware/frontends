---
"@shopware/cms-base-layer": patch
---

Ship typography for CMS-authored HTML from the layer, scoped instead of global.

HTML coming from the Shopware admin editor arrives without classes, so it can only be reached with element selectors. Declaring those globally also restyles markup the app does control (product names, card titles, button labels), and scoping them per CMS block hits the same problem from the other side, since blocks contain product boxes and sliders whose markup is ours.

Every place that injects admin HTML now carries a `cms-element-text` class, and the layer ships the matching stylesheet:

| Component                                      | Classes                                    |
| ---------------------------------------------- | ------------------------------------------ |
| `CmsElementText`                               | `cms-element-text`                         |
| `CmsElementHtml`                               | `cms-element-html cms-element-text`        |
| `CmsElementProductDescriptionReviews`          | `cms-element-text` on the description body |
| `FrontendAccountCustomerGroupRegistrationPage` | `cms-element-text` on the intro text       |

`app/assets/css/rich-text.css` is registered through `css: []` in the layer's `nuxt.config.ts`, so apps get it by extending the layer - nothing to wire up. It is plain CSS on purpose, so it also works for apps that don't use UnoCSS. Besides headings and lists it now covers `img`/`iframe`/`video` (`max-width: 100%`, the usual culprit for a text element blowing up the layout on mobile), tables, `hr` and trailing margins.

Values read from `--rte-*` custom properties with built-in fallbacks, so retheming means setting a property rather than redeclaring a rule:

```css
:root {
  --rte-h1-size: 3rem;
}

.cms-block-image-text-cover .cms-element-text {
  --rte-h1-size: 3.5rem;
}
```

See `CmsElementText.md` for the full list of properties.

Details:

- `renderHtml`'s `container` config accepts an optional `class`, applied to the wrapping element.
- `renderHtml` no longer mutates its module-level default config, so a per-call `container` option cannot leak into subsequent renders.
- Removed the `<style scoped>` block from `CmsElementText.vue`. It never had any effect: the content is produced by a render function, and Vue only applies the scope id to the container root, not to its descendants. Apps compensating for that with global element selectors can drop them.
- The stylesheet uses `:where()` throughout, keeping specificity at `(0,1,0)`. Editor-set utility classes and inline styles still win, and the rules beat a framework reset regardless of stylesheet order.
- `CmsElementText` no longer duplicates `cms-element-text` on its missing-content placeholder.
- `CmsBlockImageTextRow`'s `:deep(.cms-element-text)` rule (`align-self: stretch`, `min-height: 3rem`) now actually matches, because the class is present whenever content is rendered and not only on the empty placeholder.

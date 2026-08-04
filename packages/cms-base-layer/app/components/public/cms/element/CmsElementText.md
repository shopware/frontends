Display a text. Html to Vue mechanism is used to render buttons, links, images accordingly as Vue elements

## Styling CMS-authored HTML

The rendered container always carries the `cms-element-text` class. Because the
content comes from the Shopware admin editor, its tags (`h1`–`h6`, `ul`, `table`,
`img`, …) arrive without any classes, so they can only be reached with element
selectors — and those must never be declared globally, or they would also hit
product names, buttons and other markup you do control.

This layer ships that typography for you in
[`app/assets/css/rich-text.css`](../../../../assets/css/rich-text.css),
registered through `css: []` in the layer's `nuxt.config.ts`. It is plain CSS, so
it also works for apps that don't use UnoCSS. Nothing to wire up in your app.

### Retheming

Every value reads from a `--rte-*` custom property with a built-in fallback, so
you only set the properties you want to change — no need to redeclare the rules:

```css
:root {
  --rte-h1-size: 3rem;
  --rte-h1-line: 3.25rem;
  --rte-border-color: var(--color-outline-variant);
}
```

| Property                          | Default                         |
| --------------------------------- | ------------------------------- |
| `--rte-h1-size` / `--rte-h1-line` | `2.25rem` / `2.5rem`            |
| `--rte-h2-size` / `--rte-h2-line` | `1.75rem` / `2rem`              |
| `--rte-h3-size` / `--rte-h3-line` | `1.25rem` / `1.5rem`            |
| `--rte-h4-size` / `--rte-h4-line` | `1.125rem` / `1.5rem` (h4–h6)   |
| `--rte-heading-weight`            | `600`                           |
| `--rte-heading-mb`                | `10px`                          |
| `--rte-flow`                      | `1rem` (spacing between blocks) |
| `--rte-list-indent`               | `40px`                          |
| `--rte-cell-padding`              | `0.5rem 0.75rem`                |
| `--rte-border-color`              | `#e5e7eb` (tables, `hr`)        |

Because the properties are inherited, you can also scope them contextually
instead of overriding selectors:

```css
.cms-block-image-text-cover .cms-element-text {
  --rte-h1-size: 3.5rem;
}
```

### Scope

The class is set everywhere admin-authored HTML is injected, so one rule set
covers all of them:

| Component                                      | Classes                               |
| ---------------------------------------------- | ------------------------------------- |
| `CmsElementText`                               | `cms-element-text`                    |
| `CmsElementHtml`                               | `cms-element-html cms-element-text`   |
| `CmsElementProductDescriptionReviews`          | `cms-element-text` (description body) |
| `FrontendAccountCustomerGroupRegistrationPage` | `cms-element-text` (intro text)       |

Add `cms-element-text` to your own wrappers if you render admin HTML elsewhere,
for example custom fields using the HTML editor.

### Notes

The stylesheet uses `:where()` throughout, which keeps the specificity at
`(0,1,0)`. Two consequences worth knowing:

- A utility class or an inline style set by the editor still wins, without
  `!important`.
- The rules beat a framework reset (`ul { list-style: none }`) no matter which
  stylesheet is injected first, so the CSS order does not matter.

A `<style scoped>` block inside this component would _not_ work: the markup is
created by a render function, and Vue only applies the scope id to the container
root, not to its descendants.

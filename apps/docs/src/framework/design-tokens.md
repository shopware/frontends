---
head:
  - - meta
    - name: og:title
      content: Design Tokens
  - - meta
    - name: og:description
      content: "Shopware Composable Frontends color design tokens — naming conventions, usage examples, and a ready-to-paste Uno theme snippet."
  - - meta
    - name: og:image
      content: "https://frontends-og-image.vercel.app/Design%20Tokens?fontSize=150px"
nav:
  position: 40
---

# Design Tokens

Shopware Composable Frontends provides a curated set of **color design tokens** defined as [UnoCSS theme colors](https://unocss.dev/config/theme). They follow a Material-style naming scheme and serve as the foundation for consistent color usage across all Frontends projects and templates.

Templates like the [Vue Starter Template](../getting-started/templates/vue-starter-template) and its [extended variant](../getting-started/templates/vue-starter-template-extended) consume these tokens out of the box.

## Naming convention

Every token name follows the pattern **`<category>-<role>[-<variant>]`**.

| Category | Purpose | Examples |
|----------|---------|----------|
| `brand` | Primary, secondary, and tertiary brand colours with hover/pressed states | `brand-primary`, `brand-on-secondary` |
| `surface` | Backgrounds, containers, and their foreground (on-*) counterparts | `surface-surface-container-high`, `surface-on-surface` |
| `outline` | Borders and dividers | `outline-outline`, `outline-outline-focus` |
| `states` | Semantic feedback colours — info, success, warning, error | `states-error`, `states-on-warning-container` |
| `fixed` | Colours that do not change between themes | `fixed-fixed-on-image` |
| `other` | Miscellaneous — sale badges, shadows | `other-sale`, `other-shadow` |
| `overlay` | Semi-transparent dark/light overlays | `overlay-dark-high`, `overlay-light-low` |

## Usage

Because the tokens are registered as Uno `theme.colors`, they work with every color utility:

```html
<div class="bg-brand-primary text-brand-on-primary">
  Primary button
</div>

<p class="text-states-error">Something went wrong.</p>

<div class="border border-outline-outline rounded-md">
  Card with outline border
</div>

<div class="bg-overlay-dark-high">
  Dark overlay at 50 % opacity
</div>
```

## Customising tokens

Override or extend tokens in your project's `uno.config.ts`:

```ts
theme: {
  colors: {
    "brand-primary": "#123456",   // overwrite an existing token
    "custom-accent": "#FF00FF",   // add a new token
  },
}
```

The documentation keeps a copy of the token map in [`apps/docs/.vitepress/data/design-tokens-colors.ts`](https://github.com/shopware/frontends/blob/main/apps/docs/.vitepress/data/design-tokens-colors.ts) (aligned with [`templates/vue-starter-template/uno.config.ts`](https://github.com/shopware/frontends/blob/main/templates/vue-starter-template/uno.config.ts) `theme.colors`). Use the export button below to grab the full snippet ready to paste into your Uno config.

## Token reference

<ColorDesignTokens />

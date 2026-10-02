# @shopware/design-tokens

The Shopware Frontends color tokens in one framework-agnostic package. The same
tokens feed the UnoCSS theme of `@shopware/unocss-design-tokens-layer` and the
Tailwind CSS v4 theme of the React starter template, so a class such as
`bg-brand-primary` or `text-surface-on-surface` means the same color in every
template.

## Tailwind CSS v4

```css
@import "tailwindcss";
@import "@shopware/design-tokens/tailwind.css";
```

`tailwind.css` declares every token in `@theme static`, so each one becomes a
`--color-<token>` custom property and the matching utilities (`bg-*`, `text-*`,
`border-*` and the rest).

## CSS custom properties

```css
@import "@shopware/design-tokens/tokens.css";
```

`tokens.css` declares the same `--color-<token>` properties on `:root`, for
projects without Tailwind CSS.

## TypeScript and JSON

```ts
import { colors, designTokenTheme } from "@shopware/design-tokens";
```

`designTokenTheme` has the `{ colors }` shape a UnoCSS theme expects.
`@shopware/design-tokens/tokens.json` holds the same values for tools that read
JSON.

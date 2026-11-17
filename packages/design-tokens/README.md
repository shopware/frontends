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

## TypeScript

```ts
import { colors, designTokenTheme } from "@shopware/design-tokens";
```

`designTokenTheme` has the `{ colors }` shape a UnoCSS theme expects.
<!-- AUTO GENERATED CHANGELOG -->

## Changelog

Full changelog for stable version is available [here](https://github.com/shopware/frontends/blob/main/packages/design-tokens/CHANGELOG.md)

### Latest changes: 0.1.0

### Minor Changes

- [#2802](https://github.com/shopware/frontends/pull/2802) [`9ec153c`](https://github.com/shopware/frontends/commit/9ec153cc96ef6a0ede1780da378fbb6309d5e1a1) Thanks [@mdanilowicz](https://github.com/mdanilowicz)! - Added `@shopware/design-tokens`, the framework-agnostic source of the Shopware Frontends color tokens. It ships them as TypeScript (`colors`, `designTokenTheme`) and as a Tailwind CSS v4 theme (`tailwind.css`).

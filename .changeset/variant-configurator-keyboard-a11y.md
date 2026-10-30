---
"@shopware/cms-base-layer": patch
---

Make `SwVariantConfigurator` keyboard and screen-reader accessible. Each option group is now a native radio group: every option renders a visually hidden `<input type="radio">` inside its label, so options can be reached with Tab, changed with the arrow keys, and announced with their selected state. The focused option shows a visible focus ring, and the label exposes `data-selected`.

Each radio group's `name` is scoped to the component instance, so two configurators on one page that share a property group such as "Size" no longer merge into one group.

With `allowRedirect` (the default), an option picked with the arrow keys only updates the selection; the redirect to the variant happens on Enter or Space, or on click. If focus leaves the option group before that, the selection reverts to the loaded variant, so the selected option always matches the product that Add to cart uses. Without `allowRedirect`, every change still emits `change` immediately.

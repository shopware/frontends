---
"@shopware/cms-base-layer": patch
---

Make `SwVariantConfigurator` keyboard and screen-reader accessible. Each option group is now a native radio group: every option renders a visually hidden `<input type="radio">` inside its label, so options can be reached with Tab, changed with the arrow keys, and announced with their selected state. The focused option shows a visible focus ring, and the label exposes `data-selected`.

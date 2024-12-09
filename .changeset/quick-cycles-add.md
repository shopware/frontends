---
"@shopware-pwa/cms-base": minor
---

Ability to overwrite internal components

For example:

`SwSharedPrice.vue` is used for multiple times to display a price. Create a component with the same name to make `cms-base` start using your component internally.

---

⚠️ Internal components aren't part of public API so the related changes won't be published in the changelog. Try to overwrite and track the changes on your responsibility.

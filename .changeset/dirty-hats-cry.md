---
"@shopware/cms-base-layer": patch
---

Anchor tags with "btn btn-primary" classes from the API were not being
transformed to Tailwind utility classes due to condition matching issues
in the html-to-vue renderer.
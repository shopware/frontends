---
"@shopware/cms-base-layer": patch
---

Fix how `CmsElementText` renders CMS text. `CmsElementProductName` and `CmsElementCategoryName` render through it and get the same fixes.

- It renders only the content the Store API resolved. When that content was empty, it fell back to the raw `config.content` value, which the backend sanitizer never saw. Static content that the sanitizer removed completely, such as a lone `<script>`, came back unsanitized, and a `{{ … }}` placeholder that resolved to nothing was shown as it was typed. Both now render nothing, as in the Storefront. An element built by hand without `data` still renders its static config.
- It no longer shows a mapping path. The backend answers a mapping to a value that is not a string with the path itself, for example `category.customFields`. That is now treated as unresolved.
- It follows a new `content`. It read its content and config once, when it was set up, so a component that received a new `content` kept the old text.
- HTML attributes other than `class`, `style` and `align` now reach the page, for example `id`, `title` and `colspan`. They were passed in the Vue 2 shape, so server renders dropped them and client renders added `attrs="[object Object]"`. That also made the server and client markup differ on hydration.

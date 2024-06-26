---
"vue-demo-store": major
---

Updated Nuxt to `3.12.x` - this breaks layouts when two `<script` tags are inside page component. Use `defineOptions` to name your component for devtools: https://vuejs.org/api/sfc-script-setup#defineoptions otherwise Layouts might not work properly.

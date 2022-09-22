# Styling

Shopware Frontends [Demo Store Template](./../getting-started/templates.md) applies a utility-first styling approach based on [unocss](https://github.com/unocss/unocss). You can either follow this approach or use [custom styling](#use-a-custom-css-framework).

## Utility CSS

Unocss supports multiple CSS frameworks, including

- Tailwind CSS
- Windy CSS
- Bootstrap

This means you can use utilities like `mt-10` or `bg-gray-100` in all of your components along with styles like `col-md-3`. Note, that the [Demo Store Template](./../getting-started/templates.md) applies only Tailwind CSS syntax and does not mix any of the approaches.

Unocss will analyse your components and generate a CSS file that contains only the utility classes used in the implementation.

As an introduction, we recommend reading the [Utility-First Fundamentals](https://tailwindcss.com/docs/utility-first) article from Tailwind CSS.

When building layouts in a utility-first manner, you should follow some fundamental rules.

### Reusability

There will be cases when you would like to create a class instead of using a long list of utility classes for multiple components. In that case, consider creating a reusable component instead:

<div class="flex justify-center">
    <img class="object-cover w-12 h-12 rounded-full border-3 border-white dark:border-#1a1a1a mr--6" src="https://picsum.photos/id/18/100/100" />
    <img class="object-cover w-12 h-12 rounded-full border-3 border-white dark:border-#1a1a1a mr--6" src="https://picsum.photos/id/12/200/200" />
    <img class="object-cover w-12 h-12 rounded-full border-3 border-white dark:border-#1a1a1a mr--6" src="https://picsum.photos/id/29/200/200" />
</div>

```html
<img
  class="object-cover w-12 h-12 rounded-full border-3 border-white mr--6"
  src="https://picsum.photos/id/18/100/100"
/>
<img
  class="object-cover w-12 h-12 rounded-full border-3 border-white mr--6"
  src="https://picsum.photos/id/12/200/200"
/>
<img
  class="object-cover w-12 h-12 rounded-full border-3 border-white mr--6"
  src="https://picsum.photos/id/29/200/200"
/>
```

will become

```vue
<!-- ImageCircle.vue -->
<script setup>
defineProps(["imageSrc"]);
</script>

<template>
  <img
    class="object-cover w-12 h-12 rounded-full border-3 border-white mr--6"
    :src="imageSrc"
  />
</template>
```

```vue
<!--- ImageContainer.vue -->
<script setup>
defineProps(['images'])
</script>

<template>
    <ImageCircle v-for="image in images" :imageSrc="image">
</template>
```

### Responsive Design

Start your layout from the smallest viewport and work your way up. There are built in prefixes for the viewport sizes:

```html
<div class="grid md:grid-cols-2">
  <!-- some html -->
</div>
```

### State Variants

Similar to viewport breakpoints, you can also use state variants with prefixes:

```html
<div class="group flex justify-center">
  <input
    class="hover:shadow-xl border-2 border-indigo rounded-md p-3 shadow-md"
    type="text"
  />
</div>
```

<div class="flex justify-center">
    <input
        class="hover:shadow-xl focus:border-red border-indigo border-2 rounded-md p-3 shadow-md"
        type="text"
        placeholder="Hover me 🙂" />
</div>

## Use a custom CSS Framework

If you want to use a different CSS framework or fully custom styling, it's recommended to use the [Blank Template](./../getting-started/templates/blank-template.md) as a starting point. It has no pre-installed CSS framework and you can install you own.

### Remove unocss from the Demo Store Template

However, it's also possible to remove unocss from the [Demo Store Template](./../getting-started/templates/demo-store-template.md). This might be applicable when you want to make use of the component structure and logic that's already provided by the template.

Remove the `unocss` dependency from the `package.json` file

```diff
/* package.json */

-    "@unocss/nuxt": "^0.45.13",
```

Remove the unocss imports, build modules and configuration from the `nuxt.config.js` file

```diff
/* nuxt.config.js */

 import { defineNuxtConfig } from "nuxt";
-import transformerDirective from "@unocss/transformer-directives";
-import presetIcons from "@unocss/preset-icons";

 export default defineNuxtConfig({
   },
   buildModules: [
     "@vueuse/nuxt",
-    "@unocss/nuxt",
     "@shopware-pwa/nuxt3-module",
     "@shopware-pwa/cms-base",
   ],
   vueuse: {
     ssrHandlers: true,
   },
-  unocss: {
-    uno: true, // enabled `@unocss/preset-uno`
-    icons: true, // enabled `@unocss/preset-icons`
-    attributify: true, // enabled `@unocss/preset-attributify`,
-    ...
-  },
```

Eventually, run `pnpm install` to remove the unocss dependency from your installation.

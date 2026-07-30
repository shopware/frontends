---
"@shopware/cms-base-layer": patch
---

Stop registering the `@unocss/nuxt` module from the CMS layer. UnoCSS is not a dependency of this package anymore (it lives in `@shopware/unocss-design-tokens-layer`), so registering the module made every app that doesn't install UnoCSS itself fail to build with `Could not load @unocss/nuxt. Is it installed?` - for example the blank template. Apps that want the shared UnoCSS setup keep getting it from `@shopware/unocss-design-tokens-layer` or their own `@unocss/nuxt` registration.

---
"@shopware/cms-base-layer": major
---

Updates the `@shopware/cms-base-layer` package with the following changes:
- Adds support for the new `SwQuantitySelect` component
- Updates the `SwProductAddToCart` component to use the new `SwQuantitySelect` component
- Fixes the `Status` component to use the new state classes
- Updates the `uno.config.ts` file to include default styling that can be used and extended in the end-project:


## Nuxt UnoCSS Configuration Example
```ts
// nuxt.config.ts in your end-project
{
  unocss: {
    nuxtLayers: true // enable Nuxt layers support in order to merge UnoCSS configurations
  }
}
```

## UnoCSS Configuration Example
```ts
// uno.config.ts in your end-project
import { mergeConfigs } from '@unocss/core'
import baseConfig from './.nuxt/uno.config.mjs'

export default mergeConfigs(baseConfig, {
  // will be merged with the base config - all optional
  theme: {
    colors: { 
      'brand-primary': '#ff3e00',
      'brand-secondary': '#ff6a00',
    }
  },
  safelist: [
    'states-success',
  ],
  preflights: [
    {
      getCSS: () => `
        body {
            font-family: 'Inter', sans-serif;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased; 
        }
        `,
    },
  ],
})
```


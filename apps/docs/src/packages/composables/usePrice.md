---
category: CMS
---

# usePrice

Internally, `usePrice` composable uses [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat) in order to format a price according to the right currency standard, for corresponding locale and symbol.

```js
const { getFormattedPrice } = usePrice({
    currencyCode: 'EUR'
    localeCode: 'de-DE' // value taken from browser's navigator.language variable if localeCode is not provided
});

const regularPrice = getFormattedPrice(49.95);
// regularPrice: '49,95 €'
```

<!-- PLACEHOLDER_DESCRIPTION -->

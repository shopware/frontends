# usePrice

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
{{META}}
</div>







## Types




```ts
export type UsePriceReturn = {
  /**
   * Format price i.e. (2) -> 2.00 $
   */
  getFormattedPrice(value: number | string | undefined): string;
  /**
   * Update configuration
   */
  update(params: {
    localeCode?: string | undefined;
    currencyCode: string;
  }): void;
  /**
   * Currency code
   */
  currencyCode: ComputedRef<string>;
  /**
   * Currency locale
   */
  currencyLocale: ComputedRef<string>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/usePrice/usePrice.ts#L7" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

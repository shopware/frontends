# useCountries

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#context--language"><div class="bg-red">Context & Language</div></a>
</div>

Composable to manage countries





## Types


```ts
export function useCountries(
  criteria?: Schemas["Criteria"],
): UseCountriesReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCountries/useCountries.ts#L29" target="_blank">source code</a>



```ts
export type UseCountriesReturn = {
  mountedCallback(): Promise<void>;
  getCountries: ComputedRef<Schemas["Country"][]>;
  fetchCountries(): Promise<
    operations["readCountry post /country"]["response"]
  >;
  getStatesForCountry(countryId: string): Schemas["CountryState"][] | null;
  getCountriesOptions: ComputedRef<
    {
      label: string;
      value: string;
    }[]
  >;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCountries/useCountries.ts#L9" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

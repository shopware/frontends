# useSalutations

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#context--language"><div class="bg-red">Context & Language</div></a>
</div>

Composable for fetching the salutations list.





## Types


```ts
export function useSalutations(): UseSalutationsReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useSalutations/useSalutations.ts#L25" target="_blank">source code</a>



```ts
export type UseSalutationsReturn = {
  /**
   * All available salutations
   */
  getSalutations: ComputedRef<Schemas["Salutation"][]>;
  /**
   * Fetches the salutations list and assigns the result to the `salutations` property
   */
  fetchSalutations(): Promise<
    operations["readSalutation post /salutation"]["response"]
  >;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useSalutations/useSalutations.ts#L7" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

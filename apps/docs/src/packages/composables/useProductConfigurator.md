# useProductConfigurator

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#product"><div class="bg-red">Product</div></a>
</div>

Composable to change product variant.





## Types


```ts
export function useProductConfigurator(): UseProductConfiguratorReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductConfigurator/useProductConfigurator.ts#L44" target="_blank">source code</a>



```ts
export type UseProductConfiguratorReturn = {
  /**
   * Handler for action when the selected option is changed
   */
  handleChange(
    attribute: string,
    option: string,
    onChangeHandled?: () => void,
  ): Promise<void>;

  findVariantForSelectedOptions(options?: {
    [key: string]: string;
  }): Promise<Schemas["Product"] | undefined>;

  /**
   * Indicates if the options are being (re)loaded
   */
  isLoadingOptions: Ref<boolean>;
  /**
   * Object of currently selected options
   */
  getSelectedOptions: ComputedRef<{
    [key: string]: string;
  }>;
  /**
   * All assigned properties which the variant can be made of
   */
  getOptionGroups: ComputedRef<Schemas["PropertyGroup"][]>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductConfigurator/useProductConfigurator.ts#L9" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

# useNavigationContext

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#navigation--routing"><div class="bg-red">Navigation & Routing</div></a>
</div>

Composable to get navigation context from the URL.





## Types


```ts
export function useNavigationContext(
  context?: Ref<Schemas["SeoUrl"] | null>,
): UseNavigationContextReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useNavigationContext/useNavigationContext.ts#L27" target="_blank">source code</a>



```ts
export type UseNavigationContextReturn = {
  /**
   * SEO URL from the navigation context
   */
  navigationContext: ComputedRef<Schemas["SeoUrl"] | null>;
  /**
   * Route name from the navigation context
   */
  routeName: ComputedRef<Schemas["SeoUrl"]["routeName"] | undefined>;
  /**
   * Foreign key (ID) for current navigation context
   */
  foreignKey: ComputedRef<string>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useNavigationContext/useNavigationContext.ts#L7" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

# useNavigation

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#navigation--routing"><div class="bg-red">Navigation & Routing</div></a>
</div>

Composable for navigation.
Provides state for navigation trees depending on navigation type.





## Types


```ts
export function useNavigation(params?: {
  type?: Schemas["NavigationType"] | string;
}): UseNavigationReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useNavigation/useNavigation.ts#L39" target="_blank">source code</a>



```ts
export type UseNavigationReturn = {
  /**
   * List of navigation elements
   */
  navigationElements: ComputedRef<Schemas["NavigationRouteResponse"] | null>;
  /**
   * Load navigation elements
   */
  loadNavigationElements(
    params: operations["readNavigation post /navigation/{activeId}/{rootId}"]["body"],
  ): Promise<Schemas["NavigationRouteResponse"]>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useNavigation/useNavigation.ts#L12" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

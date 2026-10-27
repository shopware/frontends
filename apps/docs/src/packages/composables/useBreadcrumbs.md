# useBreadcrumbs

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#cms-shopping-experiences"><div class="bg-red">CMS (Shopping Experiences)</div></a>
</div>

Composable for breadcrumbs management.
Read the [recipe](https://developer.shopware.com/frontends/frontends-recipes/context/navigation.html).





## Types


```ts
export function useBreadcrumbs(
  newBreadcrumbs?: Breadcrumb[],
): UseBreadcrumbsReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useBreadcrumbs/useBreadcrumbs.ts#L52" target="_blank">source code</a>



```ts
export type Breadcrumb =
  | {
      name: string;
      path?: string;
    }
  | Schemas["Breadcrumb"];
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useBreadcrumbs/useBreadcrumbs.ts#L10" target="_blank">source code</a>

```ts
export type UseBreadcrumbsReturn = {
  /**
   * Clear breadcrumbs store
   */
  clearBreadcrumbs(): void;
  /**
   * List of breadcrumbs
   */
  breadcrumbs: ComputedRef<Breadcrumb[]>;
  /**
   * Build breadcrumbs dynamically for a category by fetching them from the API
   *
   * @param {operations["readBreadcrumb get /breadcrumb/{id}"]["response"]} breadcrumbs
   */
  buildDynamicBreadcrumbs(
    breadcrumbs: operations["readBreadcrumb get /breadcrumb/{id}"]["response"],
  ): Promise<void>;
  /**
   * Add a breadcrumb to the breadcrumbs list
   *
   * @param {Breadcrumb} breadcrumb
   */
  pushBreadcrumb(breadcrumb: Breadcrumb): void;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useBreadcrumbs/useBreadcrumbs.ts#L20" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

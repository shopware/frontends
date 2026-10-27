# useCmsBlock

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#cms-shopping-experiences"><div class="bg-red">CMS (Shopping Experiences)</div></a>
</div>

Composable to get cms block content





## Types


```ts
export function useCmsBlock<BLOCK_TYPE extends Schemas["CmsBlock"]>(
  content: MaybeRefOrGetter<BLOCK_TYPE>,
): UseCmsBlockReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCmsBlock/useCmsBlock.ts#L33" target="_blank">source code</a>



```ts
export type UseCmsBlockReturn = {
  /**
   * Cms block content, as it was when the composable was called.
   */
  block: Schemas["CmsBlock"];
  /**
   * Get slot content by slot name (identifier).
   *
   * Reads the block on every call, so it follows a `ref` or getter passed as
   * `content`.
   *
   * A block does not have to carry every slot its layout allows: the lookup
   * returns `undefined` at runtime for a slot that is not there, which the
   * return type does not express yet. Guard on the result.
   * @example getSlotContent("main")
   */
  getSlotContent(slotName: string): ArrayElement<Schemas["CmsBlock"]["slots"]>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useCmsBlock/useCmsBlock.ts#L9" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

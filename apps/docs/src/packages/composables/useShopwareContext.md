# useShopwareContext

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#context--language"><div class="bg-red">Context & Language</div></a>
</div>







## Types


```ts
export function useShopwareContext(): ShopwareContext 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useShopwareContext/useShopwareContext.ts#L34" target="_blank">source code</a>



```ts
export type ShopwareContext = {
  devStorefrontUrl: string | null;
  /**
   * Shopware API client
   */
  apiClient: ApiClient;
  /**
   * Browser locale, working in SSR
   * If not provided, it will be "en-US"
   */
  browserLocale: string;
  /**
   * When `true`, composables read data through the cacheable GET variants of
   * the Store API (criteria compressed into the `_criteria` query param)
   * instead of POST, so the responses can be cached by HTTP infrastructure
   * (CDN, reverse proxy, browser). Requires a backend that supports the GET
   * read routes.
   *
   * @default false
   */
  cacheableReads: boolean;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useShopwareContext/useShopwareContext.ts#L7" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

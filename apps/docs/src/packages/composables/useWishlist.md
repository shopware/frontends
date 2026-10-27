# useWishlist

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#wishlist"><div class="bg-red">Wishlist</div></a>
</div>

Composable to manage wishlist





## Types


```ts
export function useWishlist(): UseWishlistReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useWishlist/useWishlist.ts#L59" target="_blank">source code</a>



```ts
export type UseWishlistReturn = {
  /**
   * Merge products with wishlist between async (API) and sync (localstorage) wishlists
   */
  mergeWishlistProducts(): void;
  /**
   * Get products list added to wishlist
   */
  getWishlistProducts(query?: Schemas["Criteria"]): Promise<void>;
  /**
   * Clear wishlist
   */
  clearWishlist(): void;
  /**
   * Wishlist items (Product IDs)
   */
  items: ComputedRef<string[]>;
  /**
   * Current page number
   */
  currentPage: ComputedRef<number>;
  /**
   * total pages count
   */
  totalPagesCount: ComputedRef<number>;
  /**
   * total wishlist items count
   */
  count: ComputedRef<number>;
  /**
   * Indicates if the wishlist can be synced
   */
  canSyncWishlist: ComputedRef<boolean>;
  /**
   * Wishlist products
   */
  products: ComputedRef<Schemas["Product"][]>;
  /**
   * Limit number of products per page
   */
  limit: ComputedRef<number>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useWishlist/useWishlist.ts#L11" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

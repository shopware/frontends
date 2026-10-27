# useSyncWishlist

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#wishlist"><div class="bg-red">Wishlist</div></a>
</div>

Composable to manage wishlist via API





## Types


```ts
export function useSyncWishlist(): UseSyncWishlistReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useSyncWishlist/useSyncWishlist.ts#L63" target="_blank">source code</a>



```ts
export type UseSyncWishlistReturn = {
  /**
   * Get products from wishlist
   */
  getWishlistProducts(
    defaultSearchCriteria?: Schemas["Criteria"],
  ): Promise<void>;
  /**
   * Merge products with wishlist already existing in API wishlist
   */
  mergeWishlistProducts(itemsToMerge: string[]): void;
  /**
   * Add product to wishlist
   */
  addToWishlistSync(id: string): void;
  /**
   * Remove product from wishlist
   */
  removeFromWishlistSync(id: string): void;
  /**
   * Wishlist items (Product IDs)
   */
  items: ComputedRef<string[]>;
  /**
   * Wishlist items count
   */
  count: ComputedRef<number>;
  /**
   * Current page number
   */
  currentPage: ComputedRef<number>;
  /**
   * Limit number of products per page
   */
  limit: ComputedRef<number>;
  /**
   * Wishlist products
   */
  products: ComputedRef<Schemas["Product"][]>;
  /**
   * Indicates if the wishlist is loading
   */
  isLoading: Ref<boolean>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useSyncWishlist/useSyncWishlist.ts#L7" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

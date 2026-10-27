# useLocalWishlist

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#wishlist"><div class="bg-red">Wishlist</div></a>
</div>

Composable for wishlist management.





## Types


```ts
export function useLocalWishlist(): UseLocalWishlistReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useLocalWishlist/useLocalWishlist.ts#L38" target="_blank">source code</a>



```ts
export type UseLocalWishlistReturn = {
  /**
   * Get wishlist products from localstorage
   */
  getWishlistProducts(): void;
  /**
   * Add product to wishlist by its id
   */
  addToWishlist(id: string): Promise<void>;
  /**
   * Remove product from wishlist by its id
   */
  removeFromWishlist(id: string): Promise<void>;
  /**
   * Remove all products from wishlist
   */
  clearWishlist(): Promise<void>;
  /**
   * List of wishlist items
   */
  items: ComputedRef<string[]>;
  /**
   * Count of wishlist items
   */
  count: ComputedRef<number>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useLocalWishlist/useLocalWishlist.ts#L4" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

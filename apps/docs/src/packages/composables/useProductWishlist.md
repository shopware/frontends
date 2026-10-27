# useProductWishlist

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#product"><div class="bg-red">Product</div></a>
</div>

Manage wishlist for a single product.





## Types


```ts
export function useProductWishlist(
  productId: string,
): UseProductWishlistReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductWishlist/useProductWishlist.ts#L27" target="_blank">source code</a>



```ts
export type UseProductWishlistReturn = {
  /**
   * Removes product from wishlist
   */
  removeFromWishlist(): Promise<void>;
  /**
   * Adds product to wishlist
   */
  addToWishlist(): Promise<void>;
  /**
   * Indicates whether a product is in wishlist
   */
  isInWishlist: ComputedRef<boolean>;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductWishlist/useProductWishlist.ts#L6" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

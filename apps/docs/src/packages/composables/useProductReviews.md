# useProductReviews

<div class="mb-10 grid grid-cols-[80px_auto] gap-2 text-sm">
<div>Category:</div> <a href="/frontends/packages/composables/#product"><div class="bg-red">Product</div></a>
</div>

Composable for listing customer orders.





## Types


```ts
export function useProductReviews(
  product: Ref<Schemas["Product"]>,
): UseProductReviewsReturn 
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductReviews/useProductReviews.ts#L40" target="_blank">source code</a>



```ts
export type UseProductReviewsReturn = {
  /**
   * All reviews added to the product
   */
  productReviews: ComputedRef<Schemas["ProductReview"][]>;
  /**
   * Adds a review to the product
   * @param data `title` - review title, `content` - review content, `points` - review points (range of 1-5)
   * @returns
   */
  addReview(data: {
    title: string;
    content: string;
    points: number;
  }): Promise<void>;
  /**
   * Fetches the reviews list and assigns the result to the `productReviews` property
   * @param parameters {@link Schemas["Criteria"]}
   * @returns
   */
  loadProductReviews(
    parameters?: Schemas["Criteria"],
  ): Promise<
    operations["readProductReviews post /product/{productId}/reviews"]["response"]
  >;
};
```
<a style="position:relative;top:-15px;font-size:0.8em;margin:0;" href="https://github.com/shopware/frontends/tree/main/packages/composables/src/useProductReviews/useProductReviews.ts#L8" target="_blank">source code</a>


<div data-placeholder="dynamic-markdown"></div>

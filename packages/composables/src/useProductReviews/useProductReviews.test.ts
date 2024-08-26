import { describe, expect, it } from "vitest";
import { useSetup } from "../_test";
import { useProductReviews } from "./useProductReviews";
import ProductMock from "../mocks/Product";
import { ref } from "vue";

describe("useProductReviews", () => {
  it("load product reviews", async () => {
    const { vm, injections } = await useSetup(() =>
      useProductReviews(ref(ProductMock)),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.loadProductReviews();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readProductReviews"),
      expect.objectContaining({}),
    );
  });

  it("add product review", async () => {
    const { vm, injections } = await useSetup(() =>
      useProductReviews(ref(ProductMock)),
    );

    await vm.addReview({
      title: "Title",
      content: "Content",
      points: 5,
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("saveProductReview"),
      expect.objectContaining({
        body: {
          content: "Content",
          points: 5,
          title: "Title",
        },
        pathParams: {
          productId: ProductMock.id,
        },
      }),
    );
  });
});

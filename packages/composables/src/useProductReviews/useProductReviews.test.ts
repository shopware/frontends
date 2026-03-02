import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useSetup } from "../_test";
import ProductMock from "../mocks/Product";
import { useProductReviews } from "./useProductReviews";

describe("useProductReviews", () => {
  it("load product reviews", async () => {
    const { vm, injections } = useSetup(() =>
      useProductReviews(ref(ProductMock)),
    );
    injections.apiClient.invoke.mockResolvedValue({
      data: { elements: [{ id: "1", content: "Great!" }] },
    });
    await vm.loadProductReviews();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readProductReviews"),
      expect.objectContaining({}),
    );
    expect(vm.productReviews).toEqual([{ id: "1", content: "Great!" }]);
  });

  it("load product reviews with empty elements", async () => {
    const { vm, injections } = useSetup(() =>
      useProductReviews(ref(ProductMock)),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.loadProductReviews();
    expect(vm.productReviews).toEqual([]);
  });

  it("add product review", async () => {
    const { vm, injections } = useSetup(() =>
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

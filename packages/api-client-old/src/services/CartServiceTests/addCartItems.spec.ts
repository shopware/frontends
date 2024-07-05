import { addCartItems } from "../..";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../apiService");
const mockedApiInstance = defaultInstance;

describe("CartService - addCartItems", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });

  it("should call valid endpoint and return a cart", async () => {
    mockedPost.mockResolvedValueOnce({
      data: {},
    });

    await addCartItems([
      {
        type: "product",
      },
      {
        type: "credit",
      },
    ]);
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/store-api/checkout/cart/line-item", {
      items: [
        {
          type: "product",
        },
        {
          type: "credit",
        },
      ],
    });
  });
});

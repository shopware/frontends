import { clearCart } from "../cartService";
import { defaultInstance } from "../../apiService";
import { faker } from "@faker-js/faker";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CartService - clearCart", () => {
  let contextToken = faker.datatype.uuid();

  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });

  it("should return a context token", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { "sw-context-token": contextToken },
    });

    const result = await clearCart();
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/store-api/checkout/cart");
    expect(result.contextToken).toEqual(contextToken);
  });
});

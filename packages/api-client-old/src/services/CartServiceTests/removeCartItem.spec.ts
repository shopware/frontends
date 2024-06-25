import { removeCartItem } from "../cartService";
import { defaultInstance } from "../../apiService";
import { faker } from "@faker-js/faker";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CartService - removeCartItem", () => {
  const mockedDelete = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      delete: mockedDelete,
    } as any;
  });

  it("should call valid endpoint and return cart without deleted item", async () => {
    mockedDelete.mockResolvedValueOnce({
      data: {
        data: {
          name: faker.string.uuid(),
          token: faker.string.uuid(),
          lineItems: [],
        },
      },
    });

    let lineItemId = "geawq90a5dab4206843d0vc3sa8wefdf";

    const result = await removeCartItem(lineItemId);
    expect(mockedDelete).toBeCalledTimes(1);
    expect(mockedDelete).toBeCalledWith(
      "/store-api/checkout/cart/line-item?ids[]=geawq90a5dab4206843d0vc3sa8wefdf",
    );
    expect(result.lineItems).toBeUndefined();
  });

  it("should throw unhandled 400 error when non-existing lineItemId given", async () => {
    mockedDelete.mockRejectedValueOnce(
      new Error("400: CHECKOUT__CART_LINEITEM_NOT_FOUND"),
    );

    let lineItemId = "someNonExistingLineItemId";

    expect(removeCartItem(lineItemId)).rejects.toThrow(
      "400: CHECKOUT__CART_LINEITEM_NOT_FOUND",
    );
    expect(mockedDelete).toBeCalledTimes(1);
    expect(mockedDelete).toBeCalledWith(
      "/store-api/checkout/cart/line-item?ids[]=someNonExistingLineItemId",
    );
  });
});

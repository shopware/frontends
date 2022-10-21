import { getCart } from "../cartService";
import { defaultInstance } from "../../apiService";
import { faker } from "@faker-js/faker";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CartService - getCart", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });
  it("should return existing cart object", async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        data: {
          name: faker.datatype.uuid(),
          token: faker.datatype.uuid(),
          lineItems: [
            {
              id: faker.datatype.uuid(),
              label: faker.commerce.productName(),
              quantity: 5,
              payload: {
                productNumber: faker.datatype.uuid(),
              },
            },
            {
              id: faker.datatype.uuid(),
              label: faker.commerce.productName(),
              quantity: 3,
              payload: {
                productNumber: faker.datatype.uuid(),
              },
            },
          ],
        },
      },
    });

    const result = await getCart();
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith("/store-api/checkout/cart");
    expect(result.lineItems).not.toBeNull();
  });
});

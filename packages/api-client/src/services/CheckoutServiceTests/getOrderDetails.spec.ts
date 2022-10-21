import { getOrderDetails } from "../checkoutService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CheckoutService", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  describe("getOrderDetails", () => {
    it("should invoke post method to the order details endpoint with corresponding orderId parameter - no response", async () => {
      mockedPost.mockResolvedValueOnce({});

      const result = await getOrderDetails("some-order-id");
      expect(mockedPost).toBeCalledTimes(1);
      expect(mockedPost).toBeCalledWith("/store-api/order", {
        filter: [{ field: "id", type: "equals", value: "some-order-id" }],
      });
      expect(result).toBeUndefined();
    });

    it("should invoke post method to the order details endpoint with corresponding orderId parameter - proper response", async () => {
      mockedPost.mockResolvedValueOnce({
        data: {
          orders: {
            elements: [
              {
                id: "some-order-id",
              },
            ],
          },
        },
      });

      const result = await getOrderDetails("some-order-id");
      expect(mockedPost).toBeCalledTimes(1);
      expect(mockedPost).toBeCalledWith("/store-api/order", {
        filter: [{ field: "id", type: "equals", value: "some-order-id" }],
      });
      expect(result).toStrictEqual({ id: "some-order-id" });
    });
  });
});

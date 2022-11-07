import { cancelOrder } from "../checkoutService";
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
  describe("cancelOrder", () => {
    it("should invoke post method to the cancel order endpoint with corresponding orderId parameter", async () => {
      mockedPost.mockResolvedValueOnce({});

      const result = await cancelOrder("some-order-id");
      expect(mockedPost).toBeCalledTimes(1);
      expect(mockedPost).toBeCalledWith("/store-api/order/state/cancel", {
        orderId: "some-order-id",
      });
      expect(result).toBeUndefined();
    });
  });
});

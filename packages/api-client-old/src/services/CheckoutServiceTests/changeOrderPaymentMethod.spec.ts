import { changeOrderPaymentMethod } from "../checkoutService";
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
  describe("changeOrderPaymentMethod", () => {
    it("should invoke post method to the appriopriate endpoint with corresponding parameters", async () => {
      mockedPost.mockResolvedValueOnce({});

      const result = await changeOrderPaymentMethod(
        "some-order-id",
        "some-payment-id",
      );
      expect(mockedPost).toBeCalledTimes(1);
      expect(mockedPost).toBeCalledWith("/store-api/order/payment", {
        orderId: "some-order-id",
        paymentMethodId: "some-payment-id",
      });
      expect(result).toBeUndefined();
    });
  });
});

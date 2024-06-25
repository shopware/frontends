import { createOrder } from "../checkoutService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CheckoutService createOrder", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  describe("createOrder", () => {
    it("should return undefined when there is no data property in the response", async () => {
      mockedPost.mockResolvedValueOnce({});

      const result = await createOrder();
      expect(mockedPost).toBeCalledTimes(1);
      expect(mockedPost).toBeCalledWith("/store-api/checkout/order", undefined);
      expect(result).toBeUndefined();
    });
    it("should return newly added order object", async () => {
      mockedPost.mockResolvedValueOnce({
        data: {
          id: "new-order-id",
        },
      });

      const result = await createOrder();
      expect(mockedPost).toBeCalledTimes(1);
      expect(mockedPost).toBeCalledWith("/store-api/checkout/order", undefined);
      expect(result).toHaveProperty("id");
    });
    it("should make a post request including provided payload", async () => {
      mockedPost.mockResolvedValueOnce({
        data: {
          id: "new-order-id",
        },
      });

      await createOrder({
        customerComment: "Please send it packed as a gift",
      });
      expect(mockedPost).toBeCalledTimes(1);
      expect(mockedPost).toBeCalledWith("/store-api/checkout/order", {
        customerComment: "Please send it packed as a gift",
      });
    });
  });
});

import { defaultInstance } from "../../apiService";
import { setDefaultCustomerShippingAddress } from "../customerService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - setDefaultCustomerShippingAddress", () => {
  const mockedPatch = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      patch: mockedPatch,
    } as any;
  });

  it("rejects the promise if provided addressId does not exist", async () => {
    mockedPatch.mockRejectedValueOnce(
      new Error("400 - address does not exist"),
    );
    expect(setDefaultCustomerShippingAddress("1234")).rejects.toThrow(
      "400 - address does not exist",
    );
    expect(mockedPatch).toBeCalledTimes(1);
    expect(mockedPatch).toBeCalledWith(
      "/store-api/account/address/default-shipping/1234",
    );
  });

  it("returns no data if successfully set", async () => {
    mockedPatch.mockResolvedValueOnce({ data: "12345" });
    const result = await setDefaultCustomerShippingAddress("12345");
    expect(result).toBe("12345");
    expect(mockedPatch).toBeCalledTimes(1);
    expect(mockedPatch).toBeCalledWith(
      "/store-api/account/address/default-shipping/12345",
    );
  });
});

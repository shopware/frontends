import { getCustomerAddress } from "../customerService";
import { getCustomerAddressEndpoint } from "../../endpoints";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - getCustomerAddress", () => {
  const mockedGet = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      get: mockedGet,
    } as any;
  });

  it("should return address object", async () => {
    mockedGet.mockResolvedValueOnce({
      data: { data: { id: "2bbb89dfa4664bc681e80b37eaa80fb7" } },
    });
    const result = await getCustomerAddress("2bbb89dfa4664bc681e80b37eaa80fb7");
    expect(result.id).toEqual("2bbb89dfa4664bc681e80b37eaa80fb7");
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith(
      getCustomerAddressEndpoint("2bbb89dfa4664bc681e80b37eaa80fb7")
    );
  });

  it("rejects the promise if the customerId is incorrect", async () => {
    mockedGet.mockRejectedValueOnce(
      new Error("400 - such addressId does not exist")
    );
    expect(getCustomerAddress("wrong-id")).rejects.toThrow(
      "400 - such addressId does not exist"
    );
    expect(mockedGet).toBeCalledTimes(1);
    expect(mockedGet).toBeCalledWith(getCustomerAddressEndpoint("wrong-id"));
  });
});

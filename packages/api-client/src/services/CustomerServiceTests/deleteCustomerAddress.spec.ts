import { getCustomerAddressEndpoint } from "../../endpoints";
import { defaultInstance } from "../../apiService";
import { deleteCustomerAddress } from "../customerService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - deleteCustomerAddress", () => {
  const mockedDelete = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      delete: mockedDelete,
    } as any;
  });

  it("rejects the promise if the address does not exist", async () => {
    mockedDelete.mockRejectedValueOnce(
      new Error("400 - customer's address not found")
    );
    expect(
      deleteCustomerAddress("2bbb89dfa4664bc681e80b37eaa80fb7")
    ).rejects.toThrow("400 - customer's address not found");
    expect(mockedDelete).toBeCalledTimes(1);
    expect(mockedDelete).toBeCalledWith(
      getCustomerAddressEndpoint("2bbb89dfa4664bc681e80b37eaa80fb7")
    );
  });

  it("returns no data if successfully deleted", async () => {
    mockedDelete.mockResolvedValue(null);

    await deleteCustomerAddress("2bbb89dfa4664bc681e80b37eaa80fb7");
    expect(mockedDelete).toBeCalledTimes(1);
    expect(mockedDelete).toBeCalledWith(
      getCustomerAddressEndpoint("2bbb89dfa4664bc681e80b37eaa80fb7")
    );
  });
});

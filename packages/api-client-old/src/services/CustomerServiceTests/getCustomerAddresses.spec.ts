import { getCustomerAddresses } from "../customerService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - getCustomerAddresses", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });

  it("should return object of addresses", async () => {
    mockedPost.mockResolvedValueOnce({ data: { data: {} } });
    const result = await getCustomerAddresses();
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(`/store-api/account/list-address`, {});
    expect(result).toMatchObject({});
  });
});

import { logout } from "../customerService";
import { getCustomerLogoutEndpoint } from "../../endpoints";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - logout", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });

  it("should log out the customer", async () => {
    mockedPost.mockResolvedValueOnce({ data: null });
    await logout();
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getCustomerLogoutEndpoint());
  });
});

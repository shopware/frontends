import { login } from "../customerService";
import { getCustomerLoginEndpoint } from "../../endpoints";
import { defaultInstance } from "../../apiService";
import { faker } from "@faker-js/faker";
import { describe, expect, it, beforeEach, vi } from "vitest";

const credentials = {
  username: faker.internet.email(),
  password: faker.internet.password(8),
};

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - login", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });
  it("should invoke a POST request with given parameters", async () => {
    mockedPost.mockResolvedValueOnce({ data: {} } as any);

    await login(undefined);
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getCustomerLoginEndpoint(), {
      username: undefined,
      password: undefined,
    });
  });
  it("should return context token in new format if old does not exist", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { contextToken: "RmzTExFStSBW5GhPmQNicSK6bhUQhqXi" },
    });

    const result = await login({
      username: credentials.username,
      password: credentials.password,
    });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getCustomerLoginEndpoint(), {
      username: credentials.username,
      password: credentials.password,
    });

    expect(result.contextToken).toEqual("RmzTExFStSBW5GhPmQNicSK6bhUQhqXi");
  });
  it("should return context token", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { "sw-context-token": "RmzTExFStSBW5GhPmQNicSK6bhUQhqXi" },
    });

    const result = await login({
      username: credentials.username,
      password: credentials.password,
    });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getCustomerLoginEndpoint(), {
      username: credentials.username,
      password: credentials.password,
    });

    expect(result.contextToken).toEqual("RmzTExFStSBW5GhPmQNicSK6bhUQhqXi");
  });
  it("should throws unhandled rejection - 401", async () => {
    mockedPost.mockRejectedValue(new Error());

    expect(
      login({
        username: credentials.username,
        password: "wrong-password-123456",
      })
    ).rejects.toThrow();

    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getCustomerLoginEndpoint(), {
      username: credentials.username,
      password: "wrong-password-123456",
    });
  });
});

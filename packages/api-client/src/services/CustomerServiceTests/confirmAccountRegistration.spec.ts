import { getCustomerAccountConfirmEndpoint } from "../../endpoints";
import { defaultInstance } from "../../apiService";
import { faker } from "@faker-js/faker";
import { confirmAccountRegistration } from "../customerService";
import { describe, expect, it, beforeEach, vi } from "vitest";

const exampleHash = faker.internet.mac();
const exampleEm = faker.internet.mac();

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - confirmAccountRegistration", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });

  it("rejects the promise if provided hash or em does not match", async () => {
    mockedPost.mockRejectedValueOnce(new Error("400 - invalid hash or em"));
    expect(
      confirmAccountRegistration({
        hash: exampleHash,
        em: exampleEm,
      })
    ).rejects.toThrow("400 - invalid hash or em");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getCustomerAccountConfirmEndpoint(), {
      hash: exampleHash,
      em: exampleEm,
    });
  });

  it("returns customer data if successfully confirmed", async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        id: "customer-id",
      },
    });

    const result = await confirmAccountRegistration({
      hash: exampleHash,
      em: exampleEm,
    });
    expect(result).toStrictEqual({
      id: "customer-id",
    });
  });

  it("should invoke post method with given parameters", async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        id: "customer-id",
      },
    });

    await confirmAccountRegistration({
      hash: exampleHash,
      em: exampleEm,
    });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getCustomerAccountConfirmEndpoint(), {
      em: exampleEm,
      hash: exampleHash,
    });
  });
});

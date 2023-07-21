import { getCustomerResetPasswordEndpoint } from "../../endpoints";
import { defaultInstance } from "../../apiService";
import { faker } from "@faker-js/faker";
import { resetPassword } from "../customerService";
import { defaultConfig } from "../../settings";
import { describe, expect, it, beforeEach, vi } from "vitest";

const DEFAULT_ENDPOINT = "https://shopware-2.vuestorefront.io";
const email = faker.internet.email("John", "Doe");
const credentials = {
  email: email,
  storefrontUrl: defaultConfig.endpoint ?? DEFAULT_ENDPOINT,
};

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - resetPassword", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });

  it("rejects the promise if the email do not mach any in Sales Channel", async () => {
    mockedPost.mockRejectedValueOnce(new Error("400 - invalid email address"));
    expect(
      resetPassword({
        email: credentials.email,
        storefrontUrl: credentials.storefrontUrl,
      }),
    ).rejects.toThrow("400 - invalid email");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getCustomerResetPasswordEndpoint(), {
      email: credentials.email,
      storefrontUrl: credentials.storefrontUrl,
    });
  });

  it("returns no data if successfully updated", async () => {
    mockedPost.mockResolvedValueOnce(null);

    const resultWithFullParams = await resetPassword({
      email: credentials.email,
      storefrontUrl: credentials.storefrontUrl,
    });
    expect(resultWithFullParams).toBeFalsy();

    const resultWithEmptyUrl = await resetPassword({
      email: credentials.email,
      storefrontUrl: "",
    });
    expect(resultWithEmptyUrl).toBeFalsy();

    const resultWithoutUrl = await resetPassword({
      email: credentials.email,
    });
    expect(resultWithoutUrl).toBeFalsy();

    expect(mockedPost).toBeCalledTimes(3);
    expect(mockedPost).toBeCalledWith(getCustomerResetPasswordEndpoint(), {
      email: credentials.email,
      storefrontUrl: credentials.storefrontUrl,
    });
  });

  it("should set storefrontUrl from config if not provided with params ", async () => {
    await resetPassword({
      email: credentials.email,
    });
    expect(mockedPost).toBeCalledWith("/store-api/account/recovery-password", {
      email: credentials.email,
      storefrontUrl: credentials.storefrontUrl,
    });
  });

  it("should invokde post method with null if params are not provided", async () => {
    await resetPassword(null as any);
    expect(mockedPost).toBeCalledWith(
      "/store-api/account/recovery-password",
      null,
    );
  });
});

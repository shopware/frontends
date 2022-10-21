import { getConfirmPasswordResetEndpoint } from "../../endpoints";
import { defaultInstance } from "../../apiService";
import { faker } from "@faker-js/faker";
import { confirmPasswordReset } from "../customerService";
import { describe, expect, it, beforeEach, vi } from "vitest";

const exampleHash = faker.internet.mac();
const examplePassword = faker.internet.password();

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - confirmPasswordReset", () => {
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
      confirmPasswordReset({
        hash: exampleHash,
        newPassword: examplePassword,
        newPasswordConfirm: examplePassword,
      })
    ).rejects.toThrow("400 - invalid email");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getConfirmPasswordResetEndpoint(), {
      hash: exampleHash,
      newPassword: examplePassword,
      newPasswordConfirm: examplePassword,
    });
  });

  it("returns no data if successfully updated", async () => {
    mockedPost.mockResolvedValueOnce(null);

    const resultWithFullParams = await confirmPasswordReset({
      hash: exampleHash,
      newPassword: examplePassword,
      newPasswordConfirm: examplePassword,
    });
    expect(resultWithFullParams).toBeFalsy();

    const resultWithEmptyUrl = await confirmPasswordReset({
      hash: exampleHash,
      newPassword: examplePassword,
      newPasswordConfirm: examplePassword,
      storefrontUrl: "",
    });
    expect(resultWithEmptyUrl).toBeFalsy();

    const resultWithoutUrl = await confirmPasswordReset({
      hash: exampleHash,
      newPassword: examplePassword,
      newPasswordConfirm: examplePassword,
    });
    expect(resultWithoutUrl).toBeFalsy();

    expect(mockedPost).toBeCalledTimes(3);
    expect(mockedPost).toBeCalledWith(getConfirmPasswordResetEndpoint(), {
      hash: exampleHash,
      newPassword: examplePassword,
      newPasswordConfirm: examplePassword,
    });
  });

  it("should set newPasswordConfirm from newPassword", async () => {
    await confirmPasswordReset({
      hash: exampleHash,
      newPassword: examplePassword,
    });
    expect(mockedPost).toBeCalledWith(getConfirmPasswordResetEndpoint(), {
      hash: exampleHash,
      newPassword: examplePassword,
      newPasswordConfirm: examplePassword,
    });
  });

  it("should not invoke post method if params are not provided", async () => {
    await confirmPasswordReset(null as any);
    expect(mockedPost).not.toBeCalled();
  });
});

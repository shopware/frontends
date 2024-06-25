import { getCustomerUpdatePasswordEndpoint } from "../../endpoints";
import { defaultInstance } from "../../apiService";
import { faker } from "@faker-js/faker";
import { updatePassword } from "../customerService";
import { describe, expect, it, beforeEach, vi } from "vitest";

const newPassword = faker.internet.password(8);
const credentials = {
  password: faker.internet.password(8),
  newPassword: newPassword,
  newPasswordConfirm: newPassword,
};

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - updatePassword", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });

  it("rejects the promise if the password is to short", async () => {
    mockedPost.mockRejectedValueOnce(new Error("400 - password too short"));
    expect(
      updatePassword({
        password: credentials.password,
        newPassword: "!23",
        newPasswordConfirm: "!23",
      }),
    ).rejects.toThrow("400 - password too short");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getCustomerUpdatePasswordEndpoint(), {
      password: credentials.password,
      newPassword: "!23",
      newPasswordConfirm: "!23",
    });
  });

  it("rejects the promise if the passwordConfirmation does not match", async () => {
    mockedPost.mockRejectedValueOnce(
      new Error("400 - new password confirmation does not match"),
    );
    expect(
      updatePassword({
        password: credentials.password,
        newPassword: credentials.newPassword,
        newPasswordConfirm: `${credentials.newPassword}_123`,
      }),
    ).rejects.toThrow("400 - new password confirmation does not match");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getCustomerUpdatePasswordEndpoint(), {
      password: credentials.password,
      newPassword: credentials.newPassword,
      newPasswordConfirm: `${credentials.newPassword}_123`,
    });
  });

  it("returns no data if successfully updated", async () => {
    mockedPost.mockResolvedValueOnce(null);
    const result = await updatePassword({
      password: credentials.password,
      newPassword: credentials.newPassword,
      newPasswordConfirm: credentials.newPassword,
    });
    expect(result).toBeFalsy();
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getCustomerUpdatePasswordEndpoint(), {
      password: credentials.password,
      newPassword: credentials.newPassword,
      newPasswordConfirm: credentials.newPassword,
    });
  });
});

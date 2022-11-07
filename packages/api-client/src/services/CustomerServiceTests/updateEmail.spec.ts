import { getCustomerUpdateEmailEndpoint } from "../../endpoints";
import { defaultInstance } from "../../apiService";
import { faker } from "@faker-js/faker";
import { updateEmail } from "../customerService";
import { describe, expect, it, beforeEach, vi } from "vitest";

const credentials = {
  email: faker.internet.email(),
  password: faker.internet.password(8),
};

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - updateEmail", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });

  it("rejects the promise if the email confirmation is wrong", async () => {
    mockedPost.mockRejectedValueOnce(
      new Error("400 - email confirmation is wrong")
    );
    const differentEmail = faker.internet.email();
    expect(
      updateEmail({
        email: credentials.email,
        emailConfirmation: differentEmail,
        password: credentials.password,
      })
    ).rejects.toThrow("400 - email confirmation is wrong");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getCustomerUpdateEmailEndpoint(), {
      email: credentials.email,
      emailConfirmation: differentEmail,
      password: credentials.password,
    });
  });

  it("returns no data if successfully updated", async () => {
    mockedPost.mockResolvedValueOnce(null);
    await updateEmail({
      email: credentials.email,
      emailConfirmation: credentials.email,
      password: credentials.password,
    });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(getCustomerUpdateEmailEndpoint(), {
      email: credentials.email,
      emailConfirmation: credentials.email,
      password: credentials.password,
    });
  });
});

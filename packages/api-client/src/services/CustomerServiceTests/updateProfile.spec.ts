import { faker } from "@faker-js/faker";
import { defaultInstance } from "../../apiService";
import { updateProfile } from "../customerService";
import { getCustomerDetailsUpdateEndpoint } from "../../endpoints";
import { describe, expect, it, beforeEach, vi } from "vitest";

const customerData = {
  salutationId: faker.string.uuid(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  title: "d",
};

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - updateProfile", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });

  it("returns no data if successfully updated", async () => {
    mockedPost.mockResolvedValueOnce(null);
    const result = await updateProfile(customerData);

    expect(result).toBeFalsy();
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      getCustomerDetailsUpdateEndpoint(),
      customerData
    );
  });
});

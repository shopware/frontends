import { faker } from "@faker-js/faker";
import { createCustomerAddress } from "../customerService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - createCustomerAddress", () => {
  const newAddressData = {
    countryId: faker.string.uuid(),
    salutationId: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    zipcode: faker.location.zipCode(),
    city: faker.location.city(),
    street: faker.location.street(),
  };
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
  });

  it("should return created address id", async () => {
    mockedPost.mockResolvedValueOnce({
      data: "2bbb89dfa4664bc581e80b37eaa80fb7",
    });
    const result = await createCustomerAddress(newAddressData);
    expect(result).toEqual("2bbb89dfa4664bc581e80b37eaa80fb7");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      "/store-api/account/address",
      newAddressData
    );
  });
});

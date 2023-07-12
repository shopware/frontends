import { faker } from "@faker-js/faker";
import { updateCustomerAddress } from "../customerService";
import { defaultInstance } from "../../apiService";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

describe("CustomerService - updateCustomerAddress", () => {
  const newAddressData = {
    id: "some-address-id",
    countryId: faker.string.uuid(),
    salutationId: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    zipcode: faker.location.zipCode(),
    city: faker.location.city(),
    street: faker.location.street(),
  };
  const mockedPatch = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      patch: mockedPatch,
    } as any;
  });

  it("should return created address id", async () => {
    mockedPatch.mockResolvedValueOnce({
      data: "2bbb89dfa4664bc581e80b37eaa80fb7",
    });
    const result = await updateCustomerAddress(newAddressData);
    expect(result).toEqual("2bbb89dfa4664bc581e80b37eaa80fb7");
    expect(mockedPatch).toBeCalledTimes(1);
    expect(mockedPatch).toBeCalledWith(
      "/store-api/account/address/some-address-id",
      newAddressData,
    );
  });
});

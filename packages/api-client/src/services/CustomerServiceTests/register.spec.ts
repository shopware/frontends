import { faker } from "@faker-js/faker";
import { register } from "../customerService";
import { getCustomerRegisterEndpoint } from "../../endpoints";
import { defaultInstance } from "../../apiService";
import { CustomerRegistrationParams } from "@shopware-pwa/types";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance;

let customerData: CustomerRegistrationParams;

describe("CustomerService - register", () => {
  const mockedPost = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
    customerData = {
      salutationId: faker.datatype.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(8),
      email: faker.internet.email(),
      billingAddress: {
        countryId: faker.datatype.uuid(),
        street: faker.address.streetName(),
        zipcode: faker.address.zipCode(),
        city: faker.address.city(),
        phoneNumber: faker.phone.phoneNumber(),
      },
    };
  });

  it("should register the new customer with basic data provided", async () => {
    const customerId = faker.datatype.uuid();
    mockedPost.mockResolvedValueOnce({ data: customerId });
    const result = await register(customerData);
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      getCustomerRegisterEndpoint(),
      customerData
    );
    expect(result).toBe(customerId);
  });

  it("should never register a customer without billing address", async () => {
    const customerDataNew: any = {
      ...customerData,
      billingAddress: undefined,
    };

    mockedPost.mockRejectedValueOnce(new Error("400"));

    expect(register(customerDataNew)).rejects.toThrowError("400");
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith(
      getCustomerRegisterEndpoint(),
      customerDataNew
    );
  });
});

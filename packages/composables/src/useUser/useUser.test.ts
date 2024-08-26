import { useUser } from "./useUser";
import { describe, expect, it, vi } from "vitest";
import { useSetup } from "../_test";
import { ref } from "vue";

const refreshCartSpy = vi.fn();
vi.mock("../useCart/useCart.ts", async () => {
  return {
    useCart: () => {
      return {
        refreshCart: refreshCartSpy,
      };
    },
  };
});

const refreshSessionContextSpy = vi.fn();
vi.mock("../useSessionContext/useSessionContext.ts", async () => {
  return {
    useSessionContext: () => {
      return {
        refreshSessionContext: refreshSessionContextSpy,
        userFromContext: ref(),
      };
    },
  };
});

const REGISTRATION_DATA = {
  acceptedDataProtection: true,
  accountType: "private",
  salutationId: "d5e543063dd642b48ef94b02d68e5785",
  firstName: "test",
  lastName: "test",
  email: "test@test.testwwww",
  password: "ZAQ!2wsx",
  billingAddress: {
    street: "asasa",
    zipcode: "12-123",
    city: "sadasdas",
    countryId: "2de9ecc24e7b43d283302abba082b7ce",
    countryStateId: "",
  },
};

describe("useUser", () => {
  it("login function", async () => {
    const { vm, injections } = useSetup(() => useUser());

    await vm.login({ username: "test@test.zzz", password: "test" });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("login"),
      expect.anything(),
    );

    expect(refreshCartSpy).toHaveBeenCalled();
    expect(refreshSessionContextSpy).toHaveBeenCalled();
  });

  it("register function", async () => {
    const { vm, injections } = useSetup(() => useUser());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.register(REGISTRATION_DATA);

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("register"),
      expect.objectContaining({
        body: {
          ...REGISTRATION_DATA,
          storefrontUrl: "http://localhost:3000", // This is the default value from the useInternationalization
        },
      }),
    );
  });

  it("register function with refresh", async () => {
    const { vm, injections } = useSetup(() => useUser());
    injections.apiClient.invoke.mockResolvedValue({
      data: {
        active: true,
        id: "test123",
        guest: false,
      },
    });

    await vm.register(REGISTRATION_DATA);

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("register"),
      expect.objectContaining({
        body: {
          ...REGISTRATION_DATA,
          storefrontUrl: "http://localhost:3000", // This is the default value from the useInternationalization
        },
      }),
    );
    expect(vm.isLoggedIn).toBe(true);
  });

  it("logout", async () => {
    const { vm, injections } = useSetup(() => useUser());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.logout();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("logoutCustomer"),
    );
  });

  it("refreshUser", async () => {
    const { vm, injections } = useSetup(() => useUser());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.refreshUser();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readCustomer"),
      expect.anything(),
    );
  });

  it("refreshUser - error", async () => {
    const { vm } = useSetup(() => useUser(), {
      apiClient: {
        invoke: vi.fn().mockImplementation(() => {
          throw new Error("error test");
        }),
      },
    });

    expect(async () => {
      await vm.refreshUser();
    }).rejects.toThrowError();
  });

  it("loadCountry", async () => {
    const countryId = "2de9ecc24e7b43d283302abba082b7ce";
    const { vm, injections } = useSetup(() => useUser());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.loadCountry(countryId);

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readCountry"),
      expect.objectContaining({
        body: {
          filter: [
            {
              field: "id",
              type: "equals",
              value: countryId,
            },
          ],
        },
      }),
    );

    injections.apiClient.invoke.mockResolvedValue({
      data: {
        elements: [
          {
            name: "Poland",
            id: "2de9ecc24e",
          },
        ],
      },
    });
    await vm.loadCountry(countryId);
    expect(vm.country).toEqual({ name: "Poland", id: "2de9ecc24e" });
  });

  it("updatePersonalInfo", async () => {
    const { vm, injections } = useSetup(() => useUser());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.updatePersonalInfo({
      firstName: "test",
      lastName: "test",
      salutationId: "d5e543063dd642b48ef94b02d68e5785",
      title: "",
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("changeProfile"),
      expect.objectContaining({
        body: {
          firstName: "test",
          lastName: "test",
          salutationId: "d5e543063dd642b48ef94b02d68e5785",
          title: "",
        },
      }),
    );
  });

  it("updateEmail", () => {
    const { vm, injections } = useSetup(() => useUser());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.updateEmail({
      email: "test@test.test",
      emailConfirmation: "test@test.test",
      password: "test",
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("changeEmail"),
      expect.objectContaining({
        body: {
          email: "test@test.test",
          emailConfirmation: "test@test.test",
          password: "test",
        },
      }),
    );
  });

  it("setDefaultPaymentMethod", async () => {
    const { vm, injections } = useSetup(() => useUser());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.setDefaultPaymentMethod("test");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("changePaymentMethod"),
      expect.objectContaining({
        pathParams: {
          paymentMethodId: "test",
        },
      }),
    );
  });

  it("loadSalutation", async () => {
    const { vm, injections } = useSetup(() => useUser());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.loadSalutation("test");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readSalutation"),
      expect.objectContaining({
        body: {
          filter: [
            {
              field: "id",
              type: "equals",
              value: "test",
            },
          ],
        },
      }),
    );

    injections.apiClient.invoke.mockResolvedValue({
      data: { elements: [{ id: "test", name: "test" }] },
    });
    await vm.loadSalutation("test");

    expect(vm.salutation).toEqual({ id: "test", name: "test" });
  });
});

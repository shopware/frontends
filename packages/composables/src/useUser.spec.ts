import { useUser } from "./useUser";
import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import * as apiExports from "@shopware-pwa/api-client";
import LoginResponse from "./mocks/LoginResponse";
const Component = {
  template: "<div/>",
  props: {},
  setup() {
    const {
      login,
      register,
      user,
      isLoggedIn,
      isCustomerSession,
      isGuestSession,
      refreshUser,
      logout,
      updateEmail,
      updatePersonalInfo,
      setDefaultPaymentMethod,
      loadSalutation,
      salutation,
      loadCountry,
      country,
      defaultBillingAddressId,
      defaultShippingAddressId,
      userDefaultPaymentMethod,
      userDefaultBillingAddress,
      userDefaultShippingAddress,
    } = useUser();

    return {
      login,
      register,
      user,
      isLoggedIn,
      isCustomerSession,
      isGuestSession,
      refreshUser,
      logout,
      updateEmail,
      updatePersonalInfo,
      setDefaultPaymentMethod,
      loadSalutation,
      salutation,
      loadCountry,
      country,
      defaultBillingAddressId,
      defaultShippingAddressId,
      userDefaultPaymentMethod,
      userDefaultBillingAddress,
      userDefaultShippingAddress,
    };
  },
};

const getMockProvide = () => ({
  global: {
    provide: {
      shopware: {
        apiInstance: {
          config: {},
        },
      },
    },
  },
});

describe("useUser", () => {
  vi.spyOn(apiExports, "login").mockImplementation(() => {
    return new Promise((resolve) => {
      resolve(LoginResponse);
    });
  });

  const wrapper = shallowMount(Component, getMockProvide());
  it("login ", async () => {
    await wrapper.vm.login("test@test.zzz", "test");
    // expect(wrapper.vm.getSalutations).toStrictEqual(Salutations);
  });
});

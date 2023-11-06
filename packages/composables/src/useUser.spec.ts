import { useUser } from "./useUser";
import * as useSessionContext from "./useSessionContext";
import * as useCart from "./useCart";
import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import * as apiExports from "@shopware-pwa/api-client";
import LoginResponse from "./mocks/LoginResponse";
import { defineComponent } from "vue";

const Component = defineComponent({
  template: "<div/>",
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
});

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
  vi.spyOn(apiExports, "login").mockImplementation(async () => {
    return LoginResponse;
  });

  const useSessionContextSpy = vi
    .spyOn(useSessionContext, "useSessionContext")
    .mockImplementation((): any => {
      return {
        refreshSessionContext: () => undefined,
      };
    });
  const useCartSpy = vi
    .spyOn(useCart, "useCart")
    .mockImplementation((): any => {
      return {
        refreshCart: () => undefined,
      };
    });

  const wrapper = shallowMount(Component, getMockProvide());
  it("login function", async () => {
    await wrapper.vm.login({
      username: "test@test.zzz",
      password: "test",
    });

    expect(useSessionContextSpy).toHaveBeenCalled();
    expect(useCartSpy).toHaveBeenCalled();
  });
});

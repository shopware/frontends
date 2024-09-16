import { describe, expect, it, vi } from "vitest";
import { useCustomerPassword } from "./useCustomerPassword";
import { useSetup } from "../_test";
import { ApiClientError } from "@shopware/api-client";
import type { FetchResponse } from "ofetch";

describe("useCustomerPassword", () => {
  it("reset password", async () => {
    const { vm, injections } = await useSetup(useCustomerPassword, {
      apiClient: {
        invoke: vi.fn().mockResolvedValue({ data: {} }),
      },
    });

    await vm.resetPassword({
      email: "test@test.test",
      storefrontUrl: "http://test.test",
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("sendRecoveryMail"),
      expect.objectContaining({
        body: {
          email: "test@test.test",
          storefrontUrl: "http://test.test",
        },
      }),
    );
  });

  it("reset password - error", async () => {
    const { vm } = await useSetup(useCustomerPassword, {
      apiClient: {
        invoke: vi.fn().mockImplementation(() => {
          throw new ApiClientError({
            _data: {
              errors: [
                {
                  code: "VIOLATION::INVALID_FORMAT_ERROR",
                  status: "400",
                  title: "Constraint violation error",
                  detail: "This value is not a valid email address.",
                  source: {
                    pointer: "/email",
                  },
                  meta: {
                    parameters: {
                      "{{ value }}": "\u0022werwerewr@ddddddd\u0022",
                    },
                  },
                },
                {
                  code: "VIOLATION::IS_BLANK_ERROR",
                  status: "400",
                  title: "Constraint violation error",
                  detail: "This value should not be blank.",
                  source: {
                    pointer: "/storefrontUrl",
                  },
                  meta: {
                    parameters: {
                      "{{ value }}": "\u0022\u0022",
                    },
                  },
                },
                {
                  code: "VIOLATION::NO_SUCH_CHOICE_ERROR",
                  status: "400",
                  title: "Constraint violation error",
                  detail: "The value you selected is not a valid choice.",
                  source: {
                    pointer: "/storefrontUrl",
                  },
                  meta: {
                    parameters: {
                      "{{ value }}": "\u0022\u0022",
                      "{{ choices }}":
                        "\u0022https://demo-frontends.shopware.store/de-De\u0022, \u0022https://demo-frontends.shopware.store/de\u0022, \u0022https://demo-frontends.shopware.store\u0022, \u0022https://demo-frontends.shopware.store/testde\u0022, \u0022https://demo-frontends.shopware.store/pl-PL\u0022, \u0022https://frontends-demo.vercel.app\u0022",
                    },
                  },
                },
              ],
            },
          } as unknown as FetchResponse<{ errors: Array<{ title: string }> }>);
        }),
      },
    });

    await expect(
      vm.resetPassword({
        email: "test@test.test",
        storefrontUrl: "http://test.test",
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ApiClientError: Failed request
       - [Constraint violation error][/email] This value is not a valid email address.
       - [Constraint violation error][/storefrontUrl] This value should not be blank.
       - [Constraint violation error][/storefrontUrl] The value you selected is not a valid choice.]
    `);
  });

  it("update password", async () => {
    const { vm, injections } = await useSetup(useCustomerPassword, {
      apiClient: {
        invoke: vi.fn().mockResolvedValue({ data: {} }),
      },
    });

    await vm.updatePassword({
      newPassword: "test",
      newPasswordConfirm: "test",
      password: "test",
    });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("changePassword"),
      expect.objectContaining({
        body: {
          newPassword: "test",
          newPasswordConfirm: "test",
          password: "test",
        },
      }),
    );
  });

  it("update password - error", async () => {
    const { vm } = await useSetup(useCustomerPassword, {
      apiClient: {
        invoke: vi.fn().mockImplementation(() => {
          throw new ApiClientError({
            _data: {
              errors: [
                {
                  code: "VIOLATION::CUSTOMER_PASSWORD_NOT_CORRECT",
                  status: "400",
                  title: "Constraint violation error",
                  detail: "Your password is wrong",
                  source: {
                    pointer: "/password",
                  },
                  meta: {
                    parameters: [],
                  },
                },
              ],
            },
          } as unknown as FetchResponse<{ errors: Array<{ title: string }> }>);
        }),
      },
    });

    await expect(
      vm.updatePassword({
        newPassword: "test",
        newPasswordConfirm: "test",
        password: "test",
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ApiClientError: Failed request
       - [Constraint violation error][/password] Your password is wrong]
    `);
  });
});

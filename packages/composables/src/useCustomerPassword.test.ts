import { describe, expect, it, vi } from "vitest";
import { useCustomerPassword } from "./useCustomerPassword";
import { useSetup } from "./_test";
import { ApiClientError } from "@shopware/api-client";
import type { FetchResponse } from "ofetch";

describe("useCustomerPassword", () => {
  it("reset password", async () => {
    const { vm, injections } = await useSetup(useCustomerPassword);

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
            details: [{ title: "test" }],
          } as unknown as FetchResponse<{ errors: Array<{ title: string }> }>);
        }),
      },
    });

    await vm.resetPassword({
      email: "test@test.test",
      storefrontUrl: "http://test.test",
    });
    expect(vm.errors.resetPassword.length).not.toBe(0);
    expect(vm.errors.resetPassword).not.toBeNull();
  });

  it("update password", async () => {
    const { vm, injections } = await useSetup(useCustomerPassword);

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
            details: [{ title: "test" }],
          } as unknown as FetchResponse<{
            errors: Array<{ title: string }>;
          }>);
        }),
      },
    });

    await vm.updatePassword({
      newPassword: "test",
      newPasswordConfirm: "test",
      password: "test",
    });
    expect(vm.errors.updatePassword.length).not.toBe(0);
    expect(vm.errors.updatePassword).not.toBeNull();
  });
});

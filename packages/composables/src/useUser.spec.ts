import { useUser } from "./useUser";
import { describe, expect, it, vi } from "vitest";
import { useSetup } from "./_test";
import { ref } from "vue";

const refreshCartSpy = vi.fn();
vi.mock("./useCart.ts", async () => {
  return {
    useCart: () => {
      return {
        refreshCart: refreshCartSpy,
      };
    },
  };
});

const refreshSessionContextSpy = vi.fn();
vi.mock("./useSessionContext.ts", async () => {
  return {
    useSessionContext: () => {
      return {
        refreshSessionContext: refreshSessionContextSpy,
        userFromContext: ref(),
      };
    },
  };
});

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
});

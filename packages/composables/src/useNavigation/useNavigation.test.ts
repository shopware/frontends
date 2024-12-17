import { describe, expect, it, vi } from "vitest";
import { useSetup } from "../_test";
import Menu from "../mocks/Menu";
import { useNavigation } from "./useNavigation";

describe("useNavigation", () => {
  it("should set the menu", async () => {
    const { vm, injections } = useSetup(useNavigation);
    injections.apiClient.invoke.mockResolvedValue({ data: Menu });

    await vm.loadNavigationElements({
      depth: 3,
    });
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readNavigation"),
      expect.anything(),
    );
    expect(vm.navigationElements).not.toBeNull();
    expect(vm.navigationElements?.length).toBe(Menu.length);
  });

  it("menu is empty because of the error", async () => {
    const { vm, injections } = useSetup(useNavigation);
    vi.spyOn(console, "error").mockImplementation(() => {});

    injections.apiClient.invoke.mockRejectedValue(null);

    await vm.loadNavigationElements({
      depth: 3,
    });
    expect(vm.navigationElements?.length).toBe(0);
    expect(console.error).toHaveBeenCalledWith(
      "[useNavigation][loadNavigationElements]",
      null,
    );
  });

  it("should set the menu - empty return", async () => {
    const { vm, injections } = useSetup(useNavigation);
    injections.apiClient.invoke.mockResolvedValue({ data: undefined });

    await vm.loadNavigationElements({
      depth: 3,
    });
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readNavigation"),
      expect.anything(),
    );
    expect(vm.navigationElements).toStrictEqual([]);
  });
});

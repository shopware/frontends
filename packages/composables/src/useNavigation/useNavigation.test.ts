import { describe, expect, it } from "vitest";
import { useNavigation } from "./useNavigation";
import Menu from "../mocks/Menu";
import { useSetup } from "../_test";

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

    injections.apiClient.invoke.mockRejectedValue(null);

    await vm.loadNavigationElements({
      depth: 3,
    });
    expect(vm.navigationElements?.length).toBe(0);
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

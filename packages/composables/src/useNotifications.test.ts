import { describe, expect, it } from "vitest";
import { useNotifications } from "./useNotifications";
import { useSetup } from "./_test";

describe("useNotifications", () => {
  it("notification flow", async () => {
    const { vm } = useSetup(useNotifications);

    vm.pushError("Error message");
    vm.pushSuccess("Success message");
    vm.pushInfo("Info message");
    vm.pushWarning("Warning message");

    expect(vm.notifications.length).toBe(4);
    vm.removeOne(vm.notifications[0].id);
    expect(vm.notifications.length).toBe(3);
    vm.removeAll();
    expect(vm.notifications.length).toBe(0);
  });
});

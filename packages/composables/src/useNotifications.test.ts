import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useNotifications } from "./useNotifications";
import { useSetup } from "./_test";
describe("useNotifications", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("notification flow", async () => {
    const { vm } = useSetup(useNotifications);

    vm.pushError("Error message");
    vm.pushSuccess("Success message");
    vm.pushInfo("Info message");
    vm.pushWarning("Warning message", { persistent: true });

    expect(vm.notifications.length).toBe(4);
    vm.removeOne(vm.notifications[0].id);
    expect(vm.notifications.length).toBe(3);
    vm.removeAll();
    expect(vm.notifications.length).toBe(0);
  });

  it("notification timeout", async () => {
    const { vm } = useSetup(useNotifications);

    vm.pushError("Error message", { timeout: 100 });
    vi.runAllTimers();
    expect(vm.notifications.length).toBe(0);
  });
});

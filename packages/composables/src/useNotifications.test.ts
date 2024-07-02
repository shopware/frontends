import { describe, expect, it } from "vitest";
import { useNotifications } from "./useNotifications";
import { useSetup } from "./_test";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
describe("useNotifications", () => {
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
    await sleep(110);
    expect(vm.notifications.length).toBe(0);
  });
});

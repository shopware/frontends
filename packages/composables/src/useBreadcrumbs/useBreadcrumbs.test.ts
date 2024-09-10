import { describe, expect, it } from "vitest";
import { useBreadcrumbs } from "./useBreadcrumbs";
import { useSetup } from "../_test";

describe("useBreadcrumbs", () => {
  it("should add breadcrumbs", async () => {
    const { vm } = useSetup(() =>
      useBreadcrumbs([
        {
          name: "Test",
          path: "/",
        },
      ]),
    );

    expect(vm.breadcrumbs.length).toBe(1);
  });

  it("should clear breadcrumbs", async () => {
    const { vm } = useSetup(() =>
      useBreadcrumbs([
        {
          name: "Test",
          path: "/",
        },
      ]),
    );

    vm.clearBreadcrumbs();
    expect(vm.breadcrumbs.length).toBe(0);
  });
});

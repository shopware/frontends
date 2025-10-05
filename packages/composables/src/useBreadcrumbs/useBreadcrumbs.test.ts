import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Schemas } from "#shopware";
import { useSetup } from "../_test";
import { useBreadcrumbs } from "./useBreadcrumbs";

describe("useBreadcrumbs", () => {
  const consoleErrorSpy = vi.spyOn(console, "error");

  beforeEach(() => {
    consoleErrorSpy.mockImplementation(() => {});
  });

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

  it("should invoke buildDynamicBreadcrumbs", async () => {
    const { vm, injections } = useSetup(() => useBreadcrumbs());
    injections.apiClient.invoke.mockResolvedValue({
      data: {
        breadcrumbs: [
          {
            path: "test",
          },
        ],
      },
    });
    await vm.buildDynamicBreadcrumbs([
      { path: "test" } as Schemas["Breadcrumb"],
    ]);

    expect(vm.breadcrumbs[0]?.path).toBe("/test");
  });

  it("should push breadcrumb", async () => {
    const { vm } = useSetup(() => useBreadcrumbs());
    vm.pushBreadcrumb({
      name: "Test",
      path: "/",
    });
    expect(vm.breadcrumbs.length).toBe(1);
    vm.pushBreadcrumb({
      name: "Test",
      path: "/",
    });
    expect(vm.breadcrumbs.length).toBe(2);
  });
});

import { describe, expect, it, beforeEach, vi } from "vitest";
import { useBreadcrumbs } from "./useBreadcrumbs";
import { useSetup } from "../_test";
import type { operations } from "#shopware";

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

  it("should invoke getCategoryBreadcrumbs", async () => {
    const { vm, injections } = useSetup(() =>
      useBreadcrumbs([
        {
          name: "Test",
          path: "/",
        },
      ]),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.getCategoryBreadcrumbs("123");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readBreadcrumb"),
      expect.objectContaining({
        pathParams: {
          id: "123",
        },
      }),
    );
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
    await vm.buildDynamicBreadcrumbs({
      breadcrumbs: [{ path: "test" }],
    } as unknown as operations["readBreadcrumb get /breadcrumb/{id}"]["response"]);

    expect(vm.breadcrumbs[0].path).toBe("/test");
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

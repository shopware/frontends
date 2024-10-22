import { describe, expect, it, beforeEach, vi } from "vitest";
import { useBreadcrumbs } from "./useBreadcrumbs";
import { useSetup } from "../_test";

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
    await vm.buildDynamicBreadcrumbs("123");

    expect(vm.breadcrumbs[0].path).toBe("/test");
  });

  it("should log error when buildDynamicBreadcrumbs fails", async () => {
    const { vm, injections } = useSetup(() => useBreadcrumbs());
    injections.apiClient.invoke.mockRejectedValue(new Error("test"));
    await vm.buildDynamicBreadcrumbs("123");

    expect(consoleErrorSpy).toBeCalled();
  });
});

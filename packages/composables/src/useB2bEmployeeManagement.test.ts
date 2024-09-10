import { describe, expect, it } from "vitest";
import { useB2bEmployeeManagement } from "./useB2bEmployeeManagement";
import { useSetup } from "./_test";

describe("useB2bEmployeeManagement", () => {
  it("should trigger getEmployees api endpoint", async () => {
    const { vm, injections } = useSetup(useB2bEmployeeManagement);
    injections.apiClient.invoke.mockResolvedValue({
      data: { elements: [{ id: "test-1" }] },
    });

    await vm.getEmployees();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readEmployees"),
    );
  });
});

import { describe, expect, it } from "vitest";
import { useCustomerOrders } from "./useCustomerOrders";
import { useSetup } from "./_test";

describe("useCustomerOrders", () => {
  it("should inovke load orders", async () => {
    const { vm, injections } = useSetup(useCustomerOrders);
    injections.apiClient.invoke.mockResolvedValue({
      data: { orders: { elements: [] } },
    });
    vm.loadOrders();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readOrder"),
      expect.objectContaining({}),
    );
    expect(vm.totalPages).toBe(0);
  });

  it("should invoke change page", async () => {
    const { vm, injections } = useSetup(useCustomerOrders);
    injections.apiClient.invoke.mockResolvedValue({
      data: { orders: { elements: [] } },
    });
    vm.limit = 3;
    vm.changeCurrentPage(2);
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readOrder"),
      expect.objectContaining({
        body: {
          limit: 3,
          page: 2,
          "total-count-mode": "exact",
        },
      }),
    );
  });
});

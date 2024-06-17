import { describe, expect, it } from "vitest";
import { useCustomerOrders } from "./useCustomerOrders";
import { useSetup } from "./_test";

describe("useCustomerOrders", () => {
  it("changeLanguage", async () => {
    const { vm, injections } = useSetup(useCustomerOrders);
    injections.apiClient.invoke.mockResolvedValue({
      data: { orders: { elements: [] } },
    });
    vm.loadOrders();
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readOrder"),
      expect.objectContaining({}),
    );
  });

  it("changeCurrentPage", async () => {
    const { vm, injections } = useSetup(useCustomerOrders);
    injections.apiClient.invoke.mockResolvedValue({
      data: { orders: { elements: [] } },
    });
    vm.changeCurrentPage(2);
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readOrder"),
      expect.objectContaining({
        body: {
          page: 2,
        },
      }),
    );
  });
});

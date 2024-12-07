import { describe, expect, it } from "vitest";
import { useOrderDataProvider } from "./useOrderDataProvider";
import { useDefaultOrderAssociations } from "../useDefaultOrderAssociations/useDefaultOrderAssociations";
import { useSetup } from "../_test";
import Order from "../mocks/Order";

describe("useOrderDataProvider", () => {
  const orderAssociations = useDefaultOrderAssociations();
  it("should load order details", async () => {
    const { vm, injections } = useSetup(() => useOrderDataProvider());
    injections.apiClient.invoke.mockResolvedValue({
      data: Order,
    });
    vm.loadOrderDetails({ keyValue: "123" });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readOrder"),
      expect.objectContaining({
        body: {
          ...orderAssociations,
          filter: [{ field: "id", type: "equals", value: "123" }],
        },
      }),
    );
  });

  it("should load order details with custom associations", async () => {
    const { vm, injections } = useSetup(() => useOrderDataProvider());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    vm.loadOrderDetails({ keyValue: "123", field: "deepCode" }, { custom: {} });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readOrder"),
      expect.objectContaining({
        body: {
          ...orderAssociations,
          filter: [{ field: "deepCode", type: "equals", value: "123" }],
        },
      }),
    );
  });

  it("should get the order document file", async () => {
    const { vm, injections } = useSetup(() => useOrderDataProvider());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.getDocumentFile("file-123", "code-123");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("download"),
      expect.objectContaining({
        pathParams: {
          documentId: "file-123",
          deepLinkCode: "code-123",
        },
      }),
    );
  });

  it("getMediaFile", async () => {
    const { vm, injections } = useSetup(() => useOrderDataProvider());
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    await vm.getMediaFile(Order.orders.elements[0].id, "file-123");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("orderDownloadFile"),
      expect.objectContaining({
        accept: "application/octet-stream",
        pathParams: {
          orderId: Order.orders.elements[0].id,
          downloadId: "file-123",
        },
      }),
    );
  });
});

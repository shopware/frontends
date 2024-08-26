import { describe, expect, it } from "vitest";
import { useB2bQuoteManagement } from "./useB2bQuoteManagement";
import { useSetup } from "../_test";
/**
 * ToDo - How to mock api-client!!
 */
describe("useB2bQuoteManagement", () => {
  it("getQuoteList", async () => {
    const { vm, injections } = useSetup(useB2bQuoteManagement);
    injections.apiClient.invoke.mockResolvedValue({
      data: { elements: [{ id: "test-1" }] },
    });

    await vm.getQuoteList();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readQuotes"),
    );
  });

  it("getQuoteList - no elements", async () => {
    const { vm, injections } = useSetup(useB2bQuoteManagement);
    injections.apiClient.invoke.mockResolvedValue({ data: {} });

    expect(await vm.getQuoteList()).toStrictEqual([]);
    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readQuotes"),
    );
  });

  it("getQuote", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    injections.apiClient.invoke.mockResolvedValue({ data: null });
    await vm.getQuote("test-12");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readQuote"),
      expect.objectContaining({
        pathParams: { id: "test-12" },
        body: {
          associations: {
            lineItems: {},
            comments: {},
            stateMachineState: {},
          },
        },
      }),
    );
  });

  it("declineQuote", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    injections.apiClient.invoke.mockResolvedValue({ data: null });
    await vm.declineQuote("test-12", "test-comment");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("declineQuote"),
      expect.objectContaining({
        pathParams: { id: "test-12" },
        body: { comment: "test-comment" },
      }),
    );
  });

  it("requestChangeQuote", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    injections.apiClient.invoke.mockResolvedValue({ data: null });
    await vm.requestChangeQuote("test-12", "test-comment");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("requestChangeQuote"),
      expect.objectContaining({
        pathParams: { id: "test-12" },
        body: {
          comment: "test-comment",
        },
      }),
    );
  });

  it("changeShippingMethod", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    injections.apiClient.invoke.mockResolvedValue({ data: null });
    await vm.changeShippingMethod("test-12", "test-method");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("switchPaymentOrShippingMethod"),
      expect.objectContaining({
        pathParams: { id: "test-12" },
      }),
    );
  });

  it("changePaymentMethod", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    injections.apiClient.invoke.mockResolvedValue({ data: null });
    await vm.changePaymentMethod("test-12", "test-method");

    injections.apiClient.invoke.mockResolvedValue({ data: null });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("switchPaymentOrShippingMethod"),
      expect.objectContaining({
        pathParams: { id: "test-12" },
      }),
    );
  });

  it("requestQuote", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    injections.apiClient.invoke.mockResolvedValue({ data: null });
    await vm.requestQuote("comment");

    injections.apiClient.invoke.mockResolvedValue({ data: null });

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("requestQuote"),
      expect.objectContaining({
        body: { comment: "comment" },
      }),
    );
  });

  it("createOrderFromQuote", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    injections.apiClient.invoke.mockResolvedValue({ data: null });
    await vm.createOrderFromQuote("test-12", "test-comment");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("createOrderFromQuote"),
      expect.objectContaining({
        pathParams: { id: "test-12" },
        body: { customerComment: "test-comment" },
      }),
    );
  });
});

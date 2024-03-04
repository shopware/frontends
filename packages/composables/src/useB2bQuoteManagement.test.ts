import { describe, expect, it } from "vitest";
import { useB2bQuoteManagement } from "./useB2bQuoteManagement";
import { useSetup } from "./_test";
/**
 * ToDo - How to mock api-client!!
 */
describe("useB2bQuoteManagement", () => {
  it("getQuoteList", async () => {
    const { vm, injections } = useSetup(useB2bQuoteManagement);
    await vm.getQuoteList();

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readQuotes"),
      expect.objectContaining({}),
    );
  });

  it("getQuote", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    await vm.getQuote("test-12");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("readQuote"),
      expect.objectContaining({
        id: "test-12",
        associations: {
          lineItems: {},
          comments: {},
        },
      }),
    );
  });

  it("declineQuote", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    await vm.declineQuote("test-12", "test-comment");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("declineQuote"),
      expect.objectContaining({
        id: "test-12",
        comment: "test-comment",
      }),
    );
  });

  it("requestChangeQuote", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    await vm.requestChangeQuote("test-12", "test-comment");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("requestChangeQuote"),
      expect.objectContaining({
        id: "test-12",
        comment: "test-comment",
      }),
    );
  });

  it("changeShippingMethod", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    await vm.changeShippingMethod("test-12", "test-method");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("switchPaymentOrShippingMethod"),
      expect.objectContaining({
        id: "test-12",
      }),
    );
  });

  it("changePaymentMethod", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    await vm.changePaymentMethod("test-12", "test-method");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("switchPaymentOrShippingMethod"),
      expect.objectContaining({
        id: "test-12",
      }),
    );
  });

  it("requestQuote", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    await vm.requestQuote("comment");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("requestQuote"),
      expect.objectContaining({
        comment: "comment",
      }),
    );
  });

  it("createOrderFromQuote", async () => {
    const { vm, injections } = useSetup(() => useB2bQuoteManagement());
    await vm.createOrderFromQuote("test-12", "test-comment");

    expect(injections.apiClient.invoke).toHaveBeenCalledWith(
      expect.stringContaining("createOrderFromQuote"),
      expect.objectContaining({
        id: "test-12",
        customerComment: "test-comment",
      }),
    );
  });
});

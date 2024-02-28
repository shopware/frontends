import { describe, expect, it } from "vitest";
import { useB2bQuoteManagement } from "./useB2bQuoteManagement";
import { useSetup } from "./_test";
/**
 * ToDo - How to mock api-client!!
 */
describe("useB2bQuoteManagement", () => {
  describe("getQuoteList", () => {
    it("", () => {
      const { vm } = useSetup(() => useB2bQuoteManagement());

      vm.getQuoteList();
    });
  });

  describe("getQuote", () => {
    it("", () => {
      const { vm } = useSetup(() => useB2bQuoteManagement());

      vm.getQuote("test-12");
    });
  });

  describe("declineQuote", () => {
    it("", () => {
      const { vm } = useSetup(() => useB2bQuoteManagement());
      vm.declineQuote("test-12", "test-comment");
    });
  });

  describe("requestChangeQuote", () => {
    it("", () => {
      const { vm } = useSetup(() => useB2bQuoteManagement());
      vm.requestChangeQuote("test-12", "test-comment");
    });
  });

  describe("changeShippingMethod", () => {
    it("", () => {
      const { vm } = useSetup(() => useB2bQuoteManagement());
      vm.changeShippingMethod("test-12", "test-method");
    });
  });

  describe("changePaymentMethod", () => {
    it("", () => {
      const { vm } = useSetup(() => useB2bQuoteManagement());
      vm.changePaymentMethod("test-12", "test-method");
    });
  });

  describe("requestQuote", () => {
    it("", () => {
      const { vm } = useSetup(() => useB2bQuoteManagement());
      vm.requestQuote("test-12");
    });
  });

  describe("createOrderFromQuote", () => {
    it("", () => {
      const { vm } = useSetup(() => useB2bQuoteManagement());
      vm.createOrderFromQuote("test-12", "test-comment");
    });
  });
});

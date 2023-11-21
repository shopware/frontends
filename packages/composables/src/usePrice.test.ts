import { describe, expect, it, vi } from "vitest";
import { createApp } from "vue";
import { usePrice } from "./usePrice";

export function withSetup(composable: any) {
  let result;

  vi.mock("./useSessionContext.ts", () => ({
    useSessionContext() {
      return {
        sessionContext: {
          currency: {
            isoCode: "EUR",
          },
        },
        apiClient: { invoke: vi.fn() },
      };
    },
  }));

  const app = createApp({
    setup() {
      result = composable();
      // suppress missing template warning
      // eslint-disable-next-line
      return () => {};
    },
  });

  app.mount(document.createElement("div"));
  return [result, app];
}

describe("usePrice", () => {
  const { getFormattedPrice, update } = usePrice({
    localeCode: "en-US",
    currencyCode: "USD",
  });

  it("should be defined", () => {
    expect(usePrice).toBeDefined();
  });

  it("should init price object", () => {
    expect(getFormattedPrice("2")).toBe("$2.00");
  });

  it("should update config", () => {
    update({
      localeCode: "de-DE",
      currencyCode: "EUR",
    });
    // applied workaround for non-breaking space that is inserted by Intl.NumberFormat
    expect(getFormattedPrice(4.1).replace(/\s/g, " ")).toBe("4,10 €");
  });

  it("should return price with current locale", () => {
    update({
      currencyCode: "USD",
      currencyLocale: undefined,
    } as any);
    expect(getFormattedPrice(2.55).replace(/\s/g, " ")).toStrictEqual(`2,55 $`);
  });
});

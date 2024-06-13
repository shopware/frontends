import { describe, expect, it } from "vitest";
import { usePrice } from "./usePrice";
import { useSetup } from "./_test";

describe("usePrice", () => {
  it("should be defined", () => {
    expect(usePrice).toBeDefined();
  });

  it("should init price object", () => {
    const { vm } = useSetup(() =>
      usePrice({
        localeCode: "en-US",
        currencyCode: "USD",
      }),
    );

    expect(vm.getFormattedPrice("2")).toBe("$2.00");
  });

  it("should update config", async () => {
    const { vm } = useSetup(usePrice);

    await vm.update({
      localeCode: "de-DE",
      currencyCode: "EUR",
    });
    expect(vm.getFormattedPrice(4.1)).toMatchInlineSnapshot('"4,10 €"');
  });

  it("should return price with current locale", async () => {
    const { vm } = useSetup(usePrice);

    await vm.update({
      currencyCode: "USD",
      // @ts-expect-error string expected here
      currencyLocale: undefined,
    });
    expect(vm.getFormattedPrice(2.55)).toMatchInlineSnapshot('"2,55 $"');
  });

  it("getFormattedPrice", () => {
    const { vm } = useSetup(usePrice);
    expect(vm.getFormattedPrice(undefined)).toBe("");
  });
});

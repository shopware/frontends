import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { usePrice, useSessionContext } from "#imports";

import { useSetup } from "../_test";

// Intl separates the amount from the symbol with U+00A0
const normalize = (value: string) => value.replace(/\u00a0/g, " ");

vi.mock("@vueuse/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@vueuse/core")>();
  return {
    ...actual,
    createSharedComposable: (fn: (...args: unknown[]) => unknown) => fn,
  };
});

vi.mock("../useSessionContext/useSessionContext.ts");
const sessionContext = ref();
const currentLocaleCode = ref<string | undefined>();

beforeEach(() => {
  sessionContext.value = null;
  currentLocaleCode.value = undefined;
  vi.clearAllMocks();
  vi.mocked(useSessionContext).mockReturnValue({
    sessionContext,
    currentLocaleCode,
  } as unknown as ReturnType<typeof useSessionContext>);
});

describe("usePrice", () => {
  it("should be defined", () => {
    expect(usePrice).toBeDefined();
  });

  it("use default locale if locale is not provided", () => {
    const { vm } = useSetup(usePrice);
    expect(vm.getFormattedPrice(2.55)).toMatchInlineSnapshot('"2.55"');
    vm.update({
      currencyCode: "USD",
      localeCode: undefined,
    });

    expect(vm.currencyLocale).toBe("en-US");
    expect(vm.getFormattedPrice(2.55)).toMatchInlineSnapshot('"$2.55"');
  });

  it("should use navigator language if locale is not provided", () => {
    const { vm } = useSetup(usePrice, {
      shopware: {
        browserLocale: "de-DE",
      },
    });
    vm.update({
      currencyCode: "USD",
      localeCode: undefined,
    });

    expect(vm.currencyLocale).toBe("de-DE");
    expect(vm.getFormattedPrice(2.55)).toMatchInlineSnapshot(`"2,55 $"`);
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

  it("should init price object with params and undefined localeCode", () => {
    const { vm } = useSetup(() =>
      usePrice({
        currencyCode: "EUR",
      }),
    );

    expect(vm.currencyCode).toBe("EUR");
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
      localeCode: "de-DE",
      currencyCode: "EUR",
    });

    await vm.update({
      currencyCode: "USD",
      localeCode: undefined,
    });
    expect(vm.getFormattedPrice(2.55)).toMatchInlineSnapshot('"2,55 $"');
  });

  it("getFormattedPrice", () => {
    const { vm } = useSetup(usePrice);
    expect(vm.getFormattedPrice(undefined)).toBe("");
  });

  it("watch currency change", async () => {
    const { vm } = useSetup(usePrice);
    sessionContext.value = {
      currency: {
        isoCode: "PLN",
      },
    };
    await vm.$nextTick();
    expect(vm.currencyCode).toBe("PLN");
  });

  it("should use default en-US locale if locale is not provided", async () => {
    const { vm } = useSetup(usePrice);

    await vm.update({
      currencyCode: "USD",
    });
    expect(vm.currencyLocale).toBe("en-US");
    expect(vm.getFormattedPrice(2.55)).toMatchInlineSnapshot('"$2.55"');
  });

  it("should take locale from shopware context", async () => {
    const { vm } = useSetup(usePrice, {
      shopware: {
        browserLocale: "en-GB",
      },
    });

    await vm.update({
      currencyCode: "USD",
    });
    expect(vm.currencyLocale).toBe("en-GB");
    expect(vm.getFormattedPrice(2.55)).toMatchInlineSnapshot(`"US$2.55"`);
  });

  it("takes the locale from the session context", async () => {
    const { vm } = useSetup(usePrice);

    currentLocaleCode.value = "de-DE";
    sessionContext.value = { currency: { isoCode: "EUR" } };
    await vm.$nextTick();

    expect(vm.currencyLocale).toBe("de-DE");
    // Intl separates the amount from the symbol with U+00A0
    expect(normalize(vm.getFormattedPrice(1234.56))).toBe("1.234,56 €");
  });

  it("renders the native currency symbol the browser locale would have dropped", async () => {
    const { vm } = useSetup(usePrice, {
      shopware: {
        browserLocale: "en-US",
      },
    });

    currentLocaleCode.value = "pl-PL";
    sessionContext.value = { currency: { isoCode: "PLN" } };
    await vm.$nextTick();

    // en-US has no symbol for PLN and falls back to the ISO code
    expect(normalize(vm.getFormattedPrice(1234.56))).toBe("1234,56 zł");
  });

  it("prefers the session context locale over the browser locale", async () => {
    const { vm } = useSetup(usePrice, {
      shopware: {
        browserLocale: "en-US",
      },
    });

    currentLocaleCode.value = "de-DE";
    sessionContext.value = { currency: { isoCode: "EUR" } };
    await vm.$nextTick();

    expect(vm.currencyLocale).toBe("de-DE");
  });

  it("keeps a locale given as a param when the session context arrives", async () => {
    const { vm } = useSetup(() =>
      usePrice({
        localeCode: "en-US",
        currencyCode: "USD",
      }),
    );

    currentLocaleCode.value = "de-DE";
    sessionContext.value = { currency: { isoCode: "EUR" } };
    await vm.$nextTick();

    expect(vm.currencyLocale).toBe("en-US");
    expect(vm.currencyCode).toBe("EUR");
  });

  it("falls back to the browser locale when the shop locale is not valid BCP-47", async () => {
    const { vm } = useSetup(usePrice, {
      shopware: {
        browserLocale: "en-US",
      },
    });

    // Intl throws RangeError on underscore-separated locales
    currentLocaleCode.value = "de_DE";
    sessionContext.value = { currency: { isoCode: "EUR" } };
    await vm.$nextTick();

    expect(vm.getFormattedPrice(1234.56)).toBe("€1,234.56");
  });

  it("returns the bare value when no locale can format the currency", async () => {
    const { vm } = useSetup(usePrice, {
      shopware: {
        browserLocale: "de_DE",
      },
    });

    currentLocaleCode.value = "de_DE";
    sessionContext.value = { currency: { isoCode: "EUR" } };
    await vm.$nextTick();

    expect(vm.getFormattedPrice(1234.56)).toBe("1234.56");
  });

  it("does not serve a stale format after the currency or locale changes", async () => {
    const { vm } = useSetup(usePrice);

    currentLocaleCode.value = "de-DE";
    sessionContext.value = { currency: { isoCode: "EUR" } };
    await vm.$nextTick();
    expect(normalize(vm.getFormattedPrice(1234.56))).toBe("1.234,56 €");

    sessionContext.value = { currency: { isoCode: "PLN" } };
    await vm.$nextTick();
    expect(normalize(vm.getFormattedPrice(1234.56))).toBe("1.234,56 PLN");

    currentLocaleCode.value = "pl-PL";
    await vm.$nextTick();
    expect(normalize(vm.getFormattedPrice(1234.56))).toBe("1234,56 zł");

    await vm.update({ currencyCode: "PLN", localeCode: "en-US" });
    expect(normalize(vm.getFormattedPrice(1234.56))).toBe("PLN 1,234.56");
  });

  it("keeps a locale set through update() when the session context changes", async () => {
    const { vm } = useSetup(usePrice);

    await vm.update({
      localeCode: "en-US",
      currencyCode: "USD",
    });

    currentLocaleCode.value = "de-DE";
    sessionContext.value = { currency: { isoCode: "EUR" } };
    await vm.$nextTick();

    expect(vm.currencyLocale).toBe("en-US");
  });
});

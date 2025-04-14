import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { usePrice, useSessionContext } from "#imports";
import { useSetup } from "../_test";

vi.mock("@vueuse/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@vueuse/core")>();
  return {
    ...actual,
    createSharedComposable: (fn: (...args: unknown[]) => unknown) => fn,
  };
});

vi.mock("../useSessionContext/useSessionContext.ts");
const sessionContext = ref();

beforeEach(() => {
  sessionContext.value = null;
  vi.clearAllMocks();
  vi.mocked(useSessionContext).mockReturnValue({
    sessionContext,
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
        browserLocale: "en-FR",
      },
    });
    vm.update({
      currencyCode: "USD",
      localeCode: undefined,
    });

    expect(vm.currencyLocale).toBe("en-FR");
    expect(vm.getFormattedPrice(2.55)).toMatchInlineSnapshot('"$2.55"');
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
});

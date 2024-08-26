import { describe, expect, it, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { usePrice } from "./usePrice";
import { useSetup } from "../_test";
import { useSessionContext } from "../useSessionContext/useSessionContext";
const currentNavigator = global.navigator;

vi.mock("../useSessionContext/useSessionContext.ts");
const sessionContext = ref();

beforeEach(() => {
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
    vi.spyOn(global, "navigator", "get").mockImplementation(
      () => ({}) as Navigator,
    );
    const { vm } = useSetup(usePrice);
    expect(vm.getFormattedPrice(2.55)).toMatchInlineSnapshot('"2.55"');
    vm.update({
      currencyCode: "USD",
      localeCode: undefined,
    });

    expect(vm.getFormattedPrice(2.55)).toMatchInlineSnapshot('"$2.55"');
  });

  it("should use navigator language if locale is not provided", () => {
    vi.spyOn(global, "navigator", "get").mockImplementation(
      () => currentNavigator,
    );
    vi.spyOn(navigator, "language", "get").mockImplementation(() => "en-FR");
    const { vm } = useSetup(usePrice);
    vm.update({
      currencyCode: "USD",
      localeCode: undefined,
    });

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
});

import { describe, expect, it, vi, beforeEach } from "vitest";
import { useCartErrorParamsResolver } from "./useCartErrorParamsResolver";
import { useCart } from "../useCart/useCart";
import { ref } from "vue";

vi.mock("../useCart/useCart.ts");

describe("useCartErrorParamsResolver", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return resolved product-stock-reached error", () => {
    vi.mocked(useCart).mockReturnValue({
      cartItems: ref([
        {
          id: "c29ad46d64474ef0b72845832f0d879b",
          label: "Greta Glass drink dispenser 5 l with tap and wooden stand",
          quantityInformation: {
            maxPurchase: 5,
          },
        },
      ]),
    } as unknown as ReturnType<typeof useCart>);
    const { resolveCartError } = useCartErrorParamsResolver();
    const error = resolveCartError({
      message:
        "The product Greta Glass drink dispenser 5 l with tap and wooden stand is only available 5 times",
      code: 0,
      key: "product-stock-reachedc29ad46d64474ef0b72845832f0d879b",
      level: 10,
      messageKey: "product-stock-reached",
    });

    expect(error).toEqual({
      params: {
        name: "Greta Glass drink dispenser 5 l with tap and wooden stand",
        quantity: 5,
      },
      messageKey: "product-stock-reached",
    });
  });

  it("should return resolved product-stock-reached-empty error if there is no product data", () => {
    vi.mocked(useCart).mockReturnValue({
      cartItems: ref([]),
    } as unknown as ReturnType<typeof useCart>);
    const { resolveCartError } = useCartErrorParamsResolver();
    const error = resolveCartError({
      message:
        "The product Greta Glass drink dispenser 5 l with tap and wooden stand is only available 5 times",
      code: 0,
      key: "product-stock-reachedc29ad46d64474ef0b72845832f0d879b",
      level: 10,
      messageKey: "product-stock-reached",
    });

    expect(error).toEqual({
      params: null,
      messageKey: "product-stock-reached-empty",
    });
  });

  it("should return passed params if error is not supported", () => {
    vi.mocked(useCart).mockReturnValue({
      cartItems: ref([]),
    } as unknown as ReturnType<typeof useCart>);
    const { resolveCartError } = useCartErrorParamsResolver();
    const error = resolveCartError({
      key: "custom-errorc29ad46d64474ef0b72845832f0d879b",
      messageKey: "custom-error",
    });

    expect(error).toEqual({
      params: {
        key: "custom-errorc29ad46d64474ef0b72845832f0d879b",
        messageKey: "custom-error",
      },
      messageKey: "custom-error",
    });
  });
});

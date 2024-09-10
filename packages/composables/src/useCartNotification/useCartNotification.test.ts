import { describe, expect, it, vi, beforeEach } from "vitest";
import { useCartNotification } from "../useCartNotification/useCartNotification";
import { useSetup } from "../_test";
import { useCart } from "../useCart/useCart";

const pushErrorSpy = vi.fn();
const pushSuccessSpy = vi.fn();

vi.mock("../useNotifications/useNotifications.ts", async () => {
  return {
    useNotifications: () => {
      return {
        pushError: pushErrorSpy,
        pushSuccess: pushSuccessSpy,
      };
    },
  };
});

vi.mock("../useCart/useCart.ts");

describe("useCartNotification", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should display success notification", () => {
    vi.mocked(useCart).mockReturnValue({
      consumeCartErrors: vi.fn(() => {
        return JSON.parse(
          JSON.stringify({
            "promotion-discount-added-1326f60448d84aed964d77ca1c2dde90": {
              message: "Discount Your lucky day! has been added",
              code: 0,
              key: "promotion-discount-added-1326f60448d84aed964d77ca1c2dde90",
              level: 0,
              messageKey: "promotion-discount-added",
            },
          }),
        );
      }),
    } as unknown as ReturnType<typeof useCart>);

    const { vm } = useSetup(() => useCartNotification());
    vm.codeErrorsNotification();
    expect(pushSuccessSpy).toBeCalledWith(
      "Discount Your lucky day! has been added",
    );
  });

  it("should return empty array if errors are not present", () => {
    vi.mocked(useCart).mockReturnValue({
      consumeCartErrors: vi.fn(() => {
        return null;
      }),
    } as unknown as ReturnType<typeof useCart>);

    const { vm } = useSetup(() => useCartNotification());
    vm.codeErrorsNotification();
    expect(pushSuccessSpy).not.toBeCalledWith();
    expect(pushErrorSpy).not.toBeCalledWith();
  });

  it("should display error notification", () => {
    vi.mocked(useCart).mockReturnValue({
      consumeCartErrors: vi.fn(() => {
        return JSON.parse(
          JSON.stringify({
            "product-stock-reachedc29ad46d64474ef0b72845832f0d879b": {
              message:
                "The product Greta Glass drink dispenser 5 l with tap and wooden stand is only available 5 times",
              code: 0,
              key: "product-stock-reachedc29ad46d64474ef0b72845832f0d879b",
              level: 10,
              messageKey: "product-stock-reached",
            },
          }),
        );
      }),
    } as unknown as ReturnType<typeof useCart>);

    const { vm } = useSetup(() => useCartNotification());
    vm.codeErrorsNotification();
    expect(pushErrorSpy).toBeCalledWith(
      "The product Greta Glass drink dispenser 5 l with tap and wooden stand is only available 5 times",
    );
  });

  it("should return errors codes", () => {
    vi.mocked(useCart).mockReturnValue({
      consumeCartErrors: vi.fn(() => {
        return JSON.parse(
          JSON.stringify({
            "product-stock-reachedc29ad46d64474ef0b72845832f0d879b": {
              message:
                "The product Greta Glass drink dispenser 5 l with tap and wooden stand is only available 5 times",
              code: 0,
              key: "product-stock-reachedc29ad46d64474ef0b72845832f0d879b",
              level: 10,
              messageKey: "product-stock-reached",
            },
          }),
        );
      }),
    } as unknown as ReturnType<typeof useCart>);
    const { vm } = useSetup(() => useCartNotification());

    expect(vm.getErrorsCodes()).toEqual([
      {
        code: 0,
        key: "product-stock-reachedc29ad46d64474ef0b72845832f0d879b",
        level: 10,
        message:
          "The product Greta Glass drink dispenser 5 l with tap and wooden stand is only available 5 times",
        messageKey: "product-stock-reached",
      },
    ]);
  });

  it("should return empty array if errors are not present", () => {
    vi.mocked(useCart).mockReturnValue({
      consumeCartErrors: vi.fn(() => {
        return null;
      }),
    } as unknown as ReturnType<typeof useCart>);

    const { vm } = useSetup(() => useCartNotification());
    expect(vm.getErrorsCodes()).toEqual([]);
  });
});

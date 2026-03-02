import { describe, expect, it } from "vitest";
import { useSetup } from "../_test";
import CmsProductBox from "../mocks/CmsProductBox";
import type { CmsElementProductBox } from "../types/cmsElementTypes";
import { useCmsElementProductBox } from "./useCmsElementProductBox";

describe("useCmsElementProductBox", () => {
  it("should init product box", () => {
    const { vm } = useSetup(() =>
      useCmsElementProductBox(CmsProductBox as unknown as CmsElementProductBox),
    );

    expect(vm.product).toEqual(CmsProductBox.data.product);
  });

  it("should use injected product when provided", () => {
    const injectedProduct = { id: "injected-id", name: "Injected Product" };
    const { vm } = useSetup(
      () =>
        useCmsElementProductBox(
          CmsProductBox as unknown as CmsElementProductBox,
        ),
      { product: injectedProduct } as Parameters<typeof useSetup>[1],
    );

    expect(vm.product).toEqual(injectedProduct);
  });

  it("should return boxLayout from config", () => {
    const { vm } = useSetup(() =>
      useCmsElementProductBox(CmsProductBox as unknown as CmsElementProductBox),
    );

    expect(vm.boxLayout).toEqual("standard");
  });
});

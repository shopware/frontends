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
});

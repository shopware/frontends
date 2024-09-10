import { useCmsBlock } from "./useCmsBlock";
import { describe, expect, it } from "vitest";
import { useSetup } from "../_test";
import type { Schemas } from "#shopware";

describe("composables - useCmsBlock", () => {
  it("get block data", () => {
    const mockData = {
      apiAlias: "cms_block",
      createdAt: "2020-08-06T06:26:23.880+00:00",
      position: 0,
      sectionId: "ri3n2ldk",
      slots: [
        {
          slot: "left-bottom",
        },
      ],
      type: "page",
    };
    const { vm } = useSetup(() => useCmsBlock(mockData as Schemas["CmsBlock"]));

    expect(vm.block).toEqual(mockData);
    expect(vm.getSlotContent("left-bottom")).toEqual(mockData.slots[0]);
  });
});

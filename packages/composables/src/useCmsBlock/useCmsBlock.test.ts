import { describe, expect, it } from "vitest";
import { ref } from "vue";

import type { Schemas } from "#shopware";

import { useSetup } from "../_test";
import { useCmsBlock } from "./useCmsBlock";

const blockWith = (slot: string) =>
  ({
    apiAlias: "cms_block",
    createdAt: "2020-08-06T06:26:23.880+00:00",
    position: 0,
    sectionId: "ri3n2ldk",
    slots: [
      {
        slot,
      },
    ],
    type: "page",
  }) as unknown as Schemas["CmsBlock"];

describe("composables - useCmsBlock", () => {
  it("get block data", () => {
    const mockData = blockWith("left-bottom");
    const { vm } = useSetup(() => useCmsBlock(mockData));

    expect(vm.block).toEqual(mockData);
    expect(vm.getSlotContent("left-bottom")).toEqual(mockData.slots[0]);
  });

  it("returns undefined for a slot the block does not carry", () => {
    const { vm } = useSetup(() => useCmsBlock(blockWith("left-bottom")));

    expect(vm.getSlotContent("right-top")).toBeUndefined();
  });

  it("looks up slots on a replaced block", () => {
    const first = blockWith("left-bottom");
    const content = ref(first);
    const { vm } = useSetup(() => useCmsBlock(content));

    expect(vm.getSlotContent("left-bottom")).toBeDefined();

    content.value = blockWith("right-top");

    expect(vm.getSlotContent("left-bottom")).toBeUndefined();
    expect(vm.getSlotContent("right-top")).toEqual(content.value.slots[0]);
    // `block` is the value read when the composable was called
    expect(vm.block).toEqual(first);
  });

  it("accepts a getter", () => {
    const content = ref(blockWith("left-bottom"));
    const { vm } = useSetup(() => useCmsBlock(() => content.value));

    content.value = blockWith("right-top");

    expect(vm.getSlotContent("right-top")).toEqual(content.value.slots[0]);
  });
});

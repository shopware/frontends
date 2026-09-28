import { describe, expect, it } from "vitest";
import { ref } from "vue";

import type { Schemas } from "#shopware";

import { useSetup } from "../_test";
import CmsPage from "../mocks/CmsPage";
import { useCmsSection } from "./useCmsSection";

const sectionWith = (sectionPosition: string) =>
  ({
    apiAlias: "cms_section",
    type: "default",
    blocks: [
      {
        apiAlias: "cms_block",
        sectionPosition,
        type: "text",
      },
    ],
  }) as unknown as Schemas["CmsSection"];

describe("useCmsSection", () => {
  it("returns the blocks placed on the given position", () => {
    const section = CmsPage.cmsPage.sections?.[0];

    const { vm } = useSetup(() =>
      useCmsSection(section as unknown as Schemas["CmsSection"]),
    );

    expect(vm.getPositionContent("main")).toEqual(section?.blocks);
  });

  it("returns an empty array for a position no block uses", () => {
    const { vm } = useSetup(() => useCmsSection(sectionWith("main")));

    expect(vm.getPositionContent("sidebar")).toEqual([]);
  });

  it("groups blocks of a replaced section", () => {
    const first = sectionWith("main");
    const content = ref(first);
    const { vm } = useSetup(() => useCmsSection(content));

    expect(vm.getPositionContent("main")).toHaveLength(1);

    content.value = sectionWith("sidebar");

    expect(vm.getPositionContent("main")).toEqual([]);
    expect(vm.getPositionContent("sidebar")).toHaveLength(1);
    // `section` is the value read when the composable was called
    expect(vm.section).toEqual(first);
  });

  it("accepts a getter", () => {
    const content = ref(sectionWith("main"));
    const { vm } = useSetup(() => useCmsSection(() => content.value));

    content.value = sectionWith("sidebar");

    expect(vm.getPositionContent("sidebar")).toHaveLength(1);
  });
});

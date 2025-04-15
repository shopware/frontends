import { describe, expect, it } from "vitest";
import type { Schemas } from "#shopware";
import { useSetup } from "../_test";
import CmsPage from "../mocks/CmsPage";
import { useCmsSection } from "./useCmsSection";

describe("useCmsSection", () => {
  it("search", async () => {
    const section = CmsPage.cmsPage.sections?.[0];

    const { vm, injections } = useSetup(() =>
      useCmsSection(section as unknown as Schemas["CmsSection"]),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    const block = await vm.getPositionContent("main");
    expect(block).toEqual(section?.blocks);
  });
});

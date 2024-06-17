import { describe, expect, it } from "vitest";
import { useCmsSection } from "./useCmsSection";
import { useSetup } from "./_test";
import type { CmsSection } from "@shopware-pwa/types";
import CmsPage from "./mocks/CmsPage";

describe("useCmsSection", () => {
  it("search", async () => {
    const { vm, injections } = useSetup(() =>
      useCmsSection(CmsPage.cmsPage.sections[0] as unknown as CmsSection),
    );
    injections.apiClient.invoke.mockResolvedValue({ data: {} });
    const block = await vm.getPositionContent("main");
    expect(block).toEqual(CmsPage.cmsPage.sections[0].blocks);
  });
});

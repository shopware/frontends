import { describe, expect, it, vi } from "vitest";

import { cmsPage } from "../../__fixtures__/cmsPage";
import { renderToHtml } from "../../__fixtures__/render";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import type { CmsComponentProps } from "../../registry";
import { CmsSectionDefault } from "../section/CmsSectionDefault";
import { CmsPage } from "./CmsPage";

function TestBlock({
  content,
  ctx,
  className,
  style,
}: CmsComponentProps<never>) {
  const block = content as { slots: Array<{ id: string }> };
  return (
    <section className={className} style={style} data-slots={ctx.slotCount}>
      {block.slots.map((slot) => slot.id).join(",")}
    </section>
  );
}

describe("CmsPage", () => {
  it("renders sections, blocks and the layout computed from the CMS data", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const registry = createCmsRegistry({
      sections: { default: CmsSectionDefault },
      blocks: { text: TestBlock },
    });
    const html = await renderToHtml(
      <CmsPage content={cmsPage} ctx={createCmsContext({ registry })} />,
    );

    expect(html).toContain("max-w-screen-2xl w-full mx-auto");
    expect(html).toContain("background-color:#ffffff");
    expect(html).toContain('class="custom-block lg:hidden"');
    expect(html).toContain("margin-top:20px");
    expect(html).toContain('data-slots="1"');
    expect(html).toContain("slot-text");
    expect(html).toContain("CmsBlockNotABlock");
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Block type "not-a-block" is not implemented'),
    );
    warn.mockRestore();
  });

  it("renders nothing for an unknown section in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    try {
      const registry = createCmsRegistry();
      const html = await renderToHtml(
        <CmsPage content={cmsPage} ctx={createCmsContext({ registry })} />,
      );
      expect(html).toBe("");
    } finally {
      vi.unstubAllEnvs();
    }
  });
});

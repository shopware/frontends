import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import type { CmsElementVimeoVideo as CmsElementVimeoVideoContent } from "../../types";
import { CmsElementVimeoVideo } from "./CmsElementVimeoVideo";

function vimeoSlot(
  config: Partial<Record<string, unknown>>,
  media: Record<string, unknown> | null = null,
): CmsElementVimeoVideoContent {
  const entries = Object.entries({
    videoID: "987",
    iframeTitle: "",
    autoplay: false,
    byLine: false,
    color: "",
    doNotTrack: true,
    loop: false,
    portrait: true,
    title: true,
    controls: true,
    needsConfirmation: false,
    previewMedia: null,
    ...config,
  }).map(([key, value]) => [key, { source: "static", value }]);

  return {
    id: "slot-vimeo",
    apiAlias: "cms_slot",
    type: "vimeo-video",
    slot: "video",
    blockId: "block-vimeo",
    config: Object.fromEntries(entries),
    data: {
      mediaId: media ? "media-1" : null,
      url: null,
      newTab: null,
      media,
      apiAlias: "cms_image",
    },
  } as unknown as CmsElementVimeoVideoContent;
}

const ctx = createCmsContext({ registry: createCmsRegistry() });

describe("CmsElementVimeoVideo", () => {
  it("renders the player iframe with the root class and the layout props", async () => {
    const html = await renderToHtml(
      <CmsElementVimeoVideo
        content={vimeoSlot({ color: "#00ff00", autoplay: true })}
        ctx={ctx}
        className="custom-slot"
        style={{ marginTop: "20px" }}
      />,
    );

    expect(html).toContain(
      'class="cms-element-vimeo-video custom-slot" style="margin-top:20px"',
    );
    expect(html).toContain(
      'src="https://player.vimeo.com/video/987?color=00ff00&amp;dnt=true&amp;title=true&amp;portrait=true&amp;controls=true&amp;autoplay=true&amp;"',
    );
    expect(html).toContain('title="Vimeo video"');
    expect(html).not.toContain("Accept");
  });

  it("renders the preview media and the consent notice instead of the iframe when confirmation is required", async () => {
    const html = await renderToHtml(
      <CmsElementVimeoVideo
        content={vimeoSlot(
          { needsConfirmation: true, iframeTitle: "Brand film" },
          {
            url: "https://cdn/preview.jpg",
            alt: "Preview",
            thumbnails: [{ width: 400, url: "https://cdn/preview-400.jpg" }],
          },
        )}
        ctx={ctx}
      />,
    );

    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("Brand film");
    expect(html).toContain('src="https://cdn/preview.jpg"');
    expect(html).toContain("transferred to Vimeo");
    expect(html).toContain(">Accept<");
  });
});

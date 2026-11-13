import { describe, expect, it } from "vitest";

import { renderToHtml } from "../../__fixtures__/render";
import { createCmsContext } from "../../context";
import { createCmsRegistry } from "../../registry";
import type { CmsElementYoutubeVideo as CmsElementYoutubeVideoContent } from "../../types";
import { CmsElementYoutubeVideo } from "./CmsElementYoutubeVideo";

function youtubeSlot(
  config: Partial<Record<string, unknown>>,
  media: Record<string, unknown> | null = null,
): CmsElementYoutubeVideoContent {
  const entries = Object.entries({
    videoID: "abc123",
    iframeTitle: "",
    autoPlay: false,
    loop: false,
    showControls: true,
    start: null,
    end: null,
    displayMode: "standard",
    advancedPrivacyMode: true,
    needsConfirmation: false,
    previewMedia: null,
    ...config,
  }).map(([key, value]) => [key, { source: "static", value }]);

  return {
    id: "slot-youtube",
    apiAlias: "cms_slot",
    type: "youtube-video",
    slot: "video",
    blockId: "block-youtube",
    config: Object.fromEntries(entries),
    data: {
      mediaId: media ? "media-1" : null,
      url: null,
      newTab: null,
      media,
      apiAlias: "cms_image",
    },
  } as unknown as CmsElementYoutubeVideoContent;
}

const ctx = createCmsContext({ registry: createCmsRegistry() });

describe("CmsElementYoutubeVideo", () => {
  it("renders the privacy-enhanced iframe with the root class and the layout props", async () => {
    const html = await renderToHtml(
      <CmsElementYoutubeVideo
        content={youtubeSlot({ start: "10" })}
        ctx={ctx}
        className="custom-slot"
        style={{ marginTop: "20px" }}
      />,
    );

    expect(html).toContain(
      'class="cms-element-youtube-video custom-slot" style="margin-top:20px"',
    );
    expect(html).toContain(
      'src="https://www.youtube-nocookie.com/embed/abc123?rel=0&amp;controls=1&amp;start=10&amp;disablekb=1"',
    );
    expect(html).toContain('title="YouTube video"');
    expect(html).toContain('allowFullScreen=""');
    expect(html).not.toContain("Accept");
  });

  it("uses the configured iframe title", async () => {
    const html = await renderToHtml(
      <CmsElementYoutubeVideo
        content={youtubeSlot({ iframeTitle: "Product teaser" })}
        ctx={ctx}
      />,
    );

    expect(html).toContain('title="Product teaser"');
  });

  it("renders the preview media and the consent notice instead of the iframe when confirmation is required", async () => {
    const html = await renderToHtml(
      <CmsElementYoutubeVideo
        content={youtubeSlot(
          { needsConfirmation: true },
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
    expect(html).toContain('src="https://cdn/preview.jpg"');
    expect(html).toContain('alt="Preview"');
    expect(html).toContain("transferred to YouTube");
    expect(html).toContain(">Accept<");
  });

  it("merges app translations over the English defaults", async () => {
    const html = await renderToHtml(
      <CmsElementYoutubeVideo
        content={youtubeSlot({ needsConfirmation: true })}
        ctx={createCmsContext({
          registry: createCmsRegistry(),
          translations: {
            cms: { video: { acceptButtonLabel: "Akzeptieren" } },
          },
        })}
      />,
    );

    expect(html).toContain(">Akzeptieren<");
    expect(html).toContain("transferred to YouTube");
  });
});
